import { NextResponse } from 'next/server';
import type { FirestoreAnnonce } from '@/types/firestore';

import { adminDb } from '@/lib/firebase-admin';

const db = adminDb;

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    // Récupérer l'annonce du mentor
    const annonceSnapshot = await db.collection('annonces')
      .where('mentorId', '==', params.id)
      .limit(1)
      .get();

    if (annonceSnapshot.empty) {
      return NextResponse.json(null);
    }

    const annonceDoc = annonceSnapshot.docs[0];
    const annonceData = annonceDoc.data() as FirestoreAnnonce;
    const annonce = {
      id: annonceDoc.id,
      ...annonceData
    };

    const annonceWithStringDate = {
      ...annonce,
      date: annonceData.date.toDate().toISOString()
    };

    return NextResponse.json(annonceWithStringDate);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'annonce' },
      { status: 500 }
    );
  }
}
