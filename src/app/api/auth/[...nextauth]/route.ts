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


          console.log('🔍 DEBUG authorize() - userData from Firestore:', {
            uid: userRecord.uid,
            linkPhoto: userData?.linkPhoto,
            name: userData?.name,
            role: userData?.role
          });

          const userToReturn = {
            id: userRecord.uid,
            email: userRecord.email,
            name: userData?.name,
            role: userData?.role,
            image: userData?.linkPhoto
          };

          console.log('🔍 DEBUG authorize() - returning user object:', userToReturn);
          return userToReturn;
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
        console.log('🔍 DEBUG JWT callback - user object received:', {
          id: user.id,
          image: user.image,
          name: user.name,
          role: user.role
        });
        
        token.role = user.role as UserRole;
        token.id = user.id;
        token.linkPhoto = user.image;
        
        console.log('🔍 DEBUG JWT callback - token after update:', {
          id: token.id,
          linkPhoto: token.linkPhoto,
          role: token.role
        });
      } else if (token.id) {
        // Récupérer linkPhoto frais depuis la bonne collection selon le rôle
        try {
          let freshLinkPhoto = '';
          
          if (token.role === 'mentor') {
            // Pour les mentors, chercher dans la collection mentors
            const mentorDoc = await db.collection('mentors').doc(token.id as string).get();
            if (mentorDoc.exists) {
              const mentorData = mentorDoc.data();
              freshLinkPhoto = mentorData?.linkPhoto || '';
              console.log('🔍 DEBUG JWT refresh - fresh linkPhoto from mentors collection:', freshLinkPhoto);
            }
          } else {
            // Pour molt/admin, chercher dans la collection users
            const userDoc = await db.collection('users').doc(token.id as string).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              freshLinkPhoto = userData?.linkPhoto || '';
              console.log('🔍 DEBUG JWT refresh - fresh linkPhoto from users collection:', freshLinkPhoto);
            }
          }
          
          token.linkPhoto = freshLinkPhoto;
        } catch (error) {
          console.error('Error refreshing linkPhoto in JWT:', error);
        }
      }
      return token as JWT;
    },
    async session({ session, token }) {
      if (session.user) {
        console.log('🔍 DEBUG session callback - token received:', {
          id: token.id,
          linkPhoto: token.linkPhoto,
          role: token.role
        });
        
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
        session.user.image = token.linkPhoto;
        
        console.log('🔍 DEBUG session callback - final session.user:', {
          id: session.user.id,
          image: session.user.image,
          name: session.user.name,
          role: session.user.role
        });
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
