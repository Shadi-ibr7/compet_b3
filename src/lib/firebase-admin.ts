import admin from "firebase-admin";

const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET
  });
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();

