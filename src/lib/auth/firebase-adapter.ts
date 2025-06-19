import { cert, initializeApp, getApps } from "firebase-admin/app";
import { adminDb } from '../firebase-admin';
import { Adapter, AdapterUser, AdapterAccount, AdapterSession } from "next-auth/adapters";
import { UserRole } from "@/types/common";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const firestore = adminDb;

export interface CustomAdapterUser extends AdapterUser {
  role: UserRole;
  email: string;
  emailVerified: Date | null;
}

export function CustomFirebaseAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const userData = {
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name,
        image: user.image,
      };

      const ref = await firestore.collection("users").add(userData);
      const documentSnapshot = await ref.get();
      const data = documentSnapshot.data() as Omit<CustomAdapterUser, 'id'>;

      return {
        ...data,
        id: documentSnapshot.id
      } as CustomAdapterUser;
    },

    async getUser(id) {
      const documentSnapshot = await firestore
        .collection("users")
        .doc(id)
        .get();

      if (!documentSnapshot.exists) {
        return null;
      }

      const data = documentSnapshot.data();
      if (!data) return null;

      return {
        ...data,
        id: documentSnapshot.id
      } as CustomAdapterUser;
    },

    async getUserByEmail(email) {
      const querySnapshot = await firestore
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const documentSnapshot = querySnapshot.docs[0];
      const data = documentSnapshot.data();
      if (!data) return null;

      return {
        ...data,
        id: documentSnapshot.id
      } as CustomAdapterUser;
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const querySnapshot = await firestore
        .collection("accounts")
        .where("provider", "==", provider)
        .where("providerAccountId", "==", providerAccountId)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return null;
      }

      const documentSnapshot = querySnapshot.docs[0];
      const data = documentSnapshot.data();
      if (!data || !data.userId || !this.getUser) return null;

      const user = await this.getUser(data.userId);
      return user;
    },

    async updateUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      const { id, ...userData } = user;
      await firestore.collection("users").doc(id).update(userData);
      const documentSnapshot = await firestore
        .collection("users")
        .doc(id)
        .get();
      const data = documentSnapshot.data();
      if (!data) {
        throw new Error(`User ${id} not found after update`);
      }

      return {
        ...data,
        id: documentSnapshot.id
      } as AdapterUser;
    },

    async linkAccount(account: AdapterAccount) {
      const { userId, ...accountData } = account;
      await firestore.collection("accounts").add({
        userId,
        ...accountData,
      });
    },

    async createSession(session: AdapterSession) {
      await firestore.collection("sessions").doc(session.sessionToken).set({
        userId: session.userId,
        expires: session.expires,
      });
      return session;
    },

    async getSessionAndUser(sessionToken: string) {
      const documentSnapshot = await firestore
        .collection("sessions")
        .doc(sessionToken)
        .get();

      if (!documentSnapshot.exists) {
        return null;
      }

      const data = documentSnapshot.data();
      if (!data) return null;

      const session = {
        sessionToken,
        userId: data.userId,
        expires: data.expires?.toDate(),
      };

      const user = session.userId && this.getUser ? await this.getUser(session.userId) : null;

      if (!user) {
        return null;
      }

      return {
        session,
        user,
      };
    },

    async updateSession(session: Partial<AdapterSession> & { sessionToken: string }): Promise<AdapterSession | null> {
      const sessionData = {
        userId: session.userId || "",
        sessionToken: session.sessionToken,
        expires: session.expires
      };
      
      await firestore
        .collection("sessions")
        .doc(session.sessionToken)
        .update(sessionData);
      
      return sessionData as AdapterSession;
    },

    async deleteSession(sessionToken: string) {
      if (sessionToken) {
        await firestore.collection("sessions").doc(sessionToken).delete();
      }
    },
  };
}
