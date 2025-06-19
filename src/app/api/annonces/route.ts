import { NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/index';

const db = adminDb;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Vérifier si le mentor a déjà une annonce
    const existingAnnonce = await db.collection('annonces')
      .where('mentorId', '==', session.user.id)
      .limit(1)
      .get();

    if (!existingAnnonce.empty) {
      return NextResponse.json(
        { error: 'Vous avez déjà une annonce active' },
        { status: 400 }
      );
    }

    // Créer la nouvelle annonce
    const annonceData = {
      ...data,
      mentorId: session.user.id,
      date: Timestamp.fromDate(new Date()),
    };

    const docRef = await db.collection('annonces').add(annonceData);
    const newAnnonce = {
      id: docRef.id,
      ...annonceData,
      date: annonceData.date.toDate().toISOString(),
    };

    return NextResponse.json(newAnnonce);
  } catch (error) {
    console.error('Erreur lors de la création de l\'annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'annonce' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const annoncesSnapshot = await db.collection('annonces').get();
    const annonces = annoncesSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convertir la date Firestore en string
      if (data.date && typeof data.date.toDate === 'function') {
        data.date = data.date.toDate().toISOString();
      }
      return {
        id: doc.id,
        ...data
      };
    });

    return NextResponse.json(annonces);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des annonces' },
      { status: 500 }
    );
  }
}
