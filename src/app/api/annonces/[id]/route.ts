import { NextResponse } from 'next/server';
import type { FirestoreAnnonce } from '@/types/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/index';

const db = adminDb;

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const annonceRef = db.collection('annonces').doc(params.id);
    const annonceDoc = await annonceRef.get();

    if (!annonceDoc.exists) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que l'annonce appartient au mentor
    if (annonceDoc.data()?.mentorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Mettre à jour l'annonce
    const updateData = {
      ...data,
      mentorId: session.user.id, // Garantir que le mentorId ne change pas
      date: Timestamp.fromDate(new Date()), // Mettre à jour la date
    };

    await annonceRef.update(updateData);

    const updatedAnnonce = {
      id: params.id,
      ...updateData,
      date: updateData.date.toDate().toISOString(),
    };

    return NextResponse.json(updatedAnnonce);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'annonce' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const annonceRef = db.collection('annonces').doc(params.id);
    const annonceDoc = await annonceRef.get();

    if (!annonceDoc.exists) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que l'annonce appartient au mentor
    if (annonceDoc.data()?.mentorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    await annonceRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annonce:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'annonce' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const annonceDoc = await db.collection('annonces').doc(params.id).get();

    if (!annonceDoc.exists) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

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
