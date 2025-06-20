import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const db = adminDb;

export async function GET() {
  try {
    const mentorsSnapshot = await db.collection('mentors').get();
    const mentors = mentorsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convertir les dates Firestore en string si nécessaire
      if (data.dateCreation && typeof data.dateCreation.toDate === 'function') {
        data.dateCreation = data.dateCreation.toDate().toISOString();
      }
      if (data.dateModification && typeof data.dateModification.toDate === 'function') {
        data.dateModification = data.dateModification.toDate().toISOString();
      }
      return {
        id: doc.id,
        ...data
      };
    });

    return NextResponse.json(mentors);
  } catch (error) {
    console.error('Erreur lors de la récupération des mentors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des mentors' },
      { status: 500 }
    );
  }
}