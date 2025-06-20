import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/index';
import type { IMentor } from '@/types/interfaces/mentor.interface';

const db = adminDb;

// GET - Récupérer les informations du mentor
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Récupérer le mentor depuis Firestore
    const mentorDoc = await db.collection('mentors').doc(id).get();
    
    if (!mentorDoc.exists) {
      return NextResponse.json(
        { error: 'Mentor non trouvé' },
        { status: 404 }
      );
    }

    const mentorData = mentorDoc.data();
    const mentor = {
      id: mentorDoc.id,
      ...mentorData
    };

    return NextResponse.json(mentor);
  } catch (error) {
    console.error('Erreur lors de la récupération du mentor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du mentor' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les informations du mentor
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'mentor') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Vérifier que le mentor modifie bien son propre profil
    if (id !== session.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé à modifier ce profil' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { nom, job, localisation, description, linkPhoto } = data;

    // Validation des champs requis
    if (!nom || !job || !localisation || !description) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Préparer les données à mettre à jour/créer
    const mentorData = {
      nom,
      job,
      localisation,
      description,
      ...(linkPhoto && { linkPhoto }), // Mettre à jour la photo seulement si fournie
      role: 'mentor',
      dateModification: new Date()
    };

    // Vérifier si le document mentor existe
    const mentorRef = db.collection('mentors').doc(id);
    const mentorDoc = await mentorRef.get();

    if (mentorDoc.exists) {
      // Le document existe, on le met à jour
      await mentorRef.update(mentorData);
    } else {
      // Le document n'existe pas, on le crée avec des données par défaut + nouvelles données
      const completeData = {
        ...mentorData,
        name: session.user.name || '',
        number: '',
        dateCreation: new Date(),
        note: 0
      };
      await mentorRef.set(completeData);
    }

    // Récupérer le mentor mis à jour/créé
    const updatedMentorDoc = await mentorRef.get();
    const updatedMentor = {
      id: updatedMentorDoc.id,
      ...updatedMentorDoc.data()
    };

    return NextResponse.json(updatedMentor);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mentor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du mentor' },
      { status: 500 }
    );
  }
}