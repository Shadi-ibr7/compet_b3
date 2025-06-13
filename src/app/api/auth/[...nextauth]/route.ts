import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

import type { NextAuthOptions } from 'next-auth';

// Fonction pour formater la clé privée
const formatPrivateKey = (key: string | undefined) => {
  if (!key) return undefined;
  // Remplacer les \n littéraux par des vrais retours à la ligne
  const formattedKey = key
    .replace(/\\n/g, '\n')
    .replace(/"-----/g, '-----') // Enlever les guillemets au début s'ils existent
    .replace(/-----"/g, '-----'); // Enlever les guillemets à la fin s'ils existent

  // S'assurer que la clé commence et se termine correctement
  if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('La clé privée ne commence pas correctement');
    return undefined;
  }
  if (!formattedKey.includes('-----END PRIVATE KEY-----')) {
    console.error('La clé privée ne se termine pas correctement');
    return undefined;
  }

  return formattedKey;
};

const privateKey = formatPrivateKey(process.env.PRIVATE_KEY);


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          
          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName,
          };
        } catch (error) {
          console.error("Error:", error);
          return null;
        }
      }
    })
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: privateKey || '',
    }),
  }),
  session: {
    strategy: "jwt" as const
  },
  pages: {
    signIn: "/auth/signin",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
