import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { CustomFirebaseAdapter } from "@/lib/auth/firebase-adapter";

import { getAuth } from "firebase-admin/auth";
import { adminDb } from '@/lib/firebase-admin';
import { cert, getApps, initializeApp } from "firebase-admin/app";
import * as dotenv from 'dotenv';
import { UserRole } from "@/types/common";

// Charger les variables d'environnement
dotenv.config();

// Initialiser Firebase Admin si ce n'est pas déjà fait
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  });
}

const auth = getAuth();
const db = adminDb;

import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

// Fonction pour formater la clé privée
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignup: { label: "Is Signup", type: "text" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
        linkPhoto: { label: "Photo URL", type: "text" },
        address: { label: "Address", type: "text" },
        city: { label: "City", type: "text" },
        cvUrl: { label: "CV URL", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          if (credentials.isSignup === 'true') {
            // Vérifier que ce n'est pas une tentative de création de compte admin
            if (credentials.role === 'admin') {
              throw new Error('Admin accounts cannot be created through this interface');
            }

            try {
              // Créer un nouvel utilisateur
              const userRecord = await auth.createUser({
                email: credentials.email,
                password: credentials.password,
                displayName: credentials.name,
              });

              // Créer le document utilisateur dans Firestore
              await db.collection('users').doc(userRecord.uid).set({
                email: credentials.email,
                name: credentials.name,
                role: credentials.role as UserRole,
                status: credentials.role === 'molt' ? 'paid' : 'active',
                createdAt: new Date().toISOString(),
                emailVerified: false,
                linkPhoto: credentials.linkPhoto || "",
                address: credentials.address || "",
                city: credentials.city || "",
                cvUrl: credentials.cvUrl || ""
              });

              return {
                id: userRecord.uid,
                email: userRecord.email,
                name: userRecord.displayName,
                role: credentials.role as UserRole,
                linkPhoto: credentials.linkPhoto || ""
              };
            } catch (error) {
              console.error('Signup error:', error);
              if (error instanceof Error) {
                throw new Error(error.message);
              }
              throw new Error('Erreur lors de la création du compte');
            }
          }

          // Connexion normale
          const userRecord = await auth.getUserByEmail(credentials.email);

          // Récupérer les données utilisateur depuis Firestore
          const userDoc = await db
            .collection('users')
            .doc(userRecord.uid)
            .get();

          if (!userDoc.exists) {
            throw new Error('No user data found');
          }

          const userData = userDoc.data();


          return {
            id: userRecord.uid,
            email: userRecord.email,
            name: userData?.name,
            role: userData?.role,
            image: userData?.linkPhoto
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
        token.id = user.id;
        token.linkPhoto = user.linkPhoto;
      }
      return token as JWT;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
        session.user.image = token.linkPhoto;
      }
      return session;
    }
  },
  adapter: CustomFirebaseAdapter(),
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
