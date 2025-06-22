import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/credentials-config';
import { adminDb } from '@/lib/firebase-admin';
import type { IMolt } from '@/types/interfaces/molt.interface';
import type { Experience } from '@/types/common';

// POST - Ajouter une expérience
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier que l'utilisateur modifie son propre profil
    if (session.user.id !== resolvedParams.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const experienceData = await request.json();
    
    // Validation des données
    const { type, institution, position, startDate, endDate } = experienceData;
    
    if (!type || !['pro', 'education'].includes(type)) {
      return NextResponse.json({ error: 'Type d\'expérience invalide' }, { status: 400 });
    }
    
    if (!institution?.trim()) {
      return NextResponse.json({ error: 'Institution requise' }, { status: 400 });
    }
    
    if (type === 'pro' && !position?.trim()) {
      return NextResponse.json({ error: 'Poste requis pour une expérience professionnelle' }, { status: 400 });
    }
    
    if (!startDate) {
      return NextResponse.json({ error: 'Date de début requise' }, { status: 400 });
    }

    // Validation des dates
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: 'Date de début invalide' }, { status: 400 });
    }
    
    if (end && isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Date de fin invalide' }, { status: 400 });
    }
    
    if (end && start > end) {
      return NextResponse.json({ error: 'La date de fin doit être postérieure à la date de début' }, { status: 400 });
    }

    // Créer l'expérience avec un ID unique
    const experienceId = adminDb.collection('temp').doc().id;
    const newExperience: Experience & { id: string } = {
      id: experienceId,
      type,
      institution: institution.trim(),
      startDate,
      ...(type === 'pro' && position ? { position: position.trim() } : {}),
      ...(endDate ? { endDate } : {})
    };

    // Récupérer le profil Molt
    const moltDoc = await adminDb.collection('users').doc(resolvedParams.id).get();
    
    if (!moltDoc.exists) {
      return NextResponse.json({ error: 'Profil Molt non trouvé' }, { status: 404 });
    }

    const moltData = moltDoc.data() as IMolt;
    const currentExperiences = moltData.experiences || [];
    
    // Ajouter la nouvelle expérience
    const updatedExperiences = [...currentExperiences, newExperience];
    
    // Mettre à jour le document
    await adminDb.collection('users').doc(resolvedParams.id).update({
      experiences: updatedExperiences
    });

    return NextResponse.json(newExperience);
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'expérience:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout de l\'expérience' },
      { status: 500 }
    );
  }
}

// PUT - Modifier une expérience
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier que l'utilisateur modifie son propre profil
    if (session.user.id !== resolvedParams.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const requestData = await request.json();
    const { id: experienceId, ...experienceData } = requestData;
    
    if (!experienceId) {
      return NextResponse.json({ error: 'ID de l\'expérience requis' }, { status: 400 });
    }

    // Validation des données (même logique que POST)
    const { type, institution, position, startDate, endDate } = experienceData;
    
    if (!type || !['pro', 'education'].includes(type)) {
      return NextResponse.json({ error: 'Type d\'expérience invalide' }, { status: 400 });
    }
    
    if (!institution?.trim()) {
      return NextResponse.json({ error: 'Institution requise' }, { status: 400 });
    }
    
    if (type === 'pro' && !position?.trim()) {
      return NextResponse.json({ error: 'Poste requis pour une expérience professionnelle' }, { status: 400 });
    }
    
    if (!startDate) {
      return NextResponse.json({ error: 'Date de début requise' }, { status: 400 });
    }

    // Validation des dates
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: 'Date de début invalide' }, { status: 400 });
    }
    
    if (end && isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Date de fin invalide' }, { status: 400 });
    }
    
    if (end && start > end) {
      return NextResponse.json({ error: 'La date de fin doit être postérieure à la date de début' }, { status: 400 });
    }

    // Récupérer le profil Molt
    const moltDoc = await adminDb.collection('users').doc(resolvedParams.id).get();
    
    if (!moltDoc.exists) {
      return NextResponse.json({ error: 'Profil Molt non trouvé' }, { status: 404 });
    }

    const moltData = moltDoc.data() as IMolt;
    const currentExperiences = moltData.experiences || [];
    
    // Trouver et modifier l'expérience
    const experienceIndex = currentExperiences.findIndex(exp => 
      (exp as Experience & { id?: string }).id === experienceId
    );
    
    if (experienceIndex === -1) {
      return NextResponse.json({ error: 'Expérience non trouvée' }, { status: 404 });
    }

    // Créer l'expérience modifiée
    const updatedExperience: Experience & { id: string } = {
      id: experienceId,
      type,
      institution: institution.trim(),
      startDate,
      ...(type === 'pro' && position ? { position: position.trim() } : {}),
      ...(endDate ? { endDate } : {})
    };

    // Mettre à jour le tableau d'expériences
    const updatedExperiences = [...currentExperiences];
    updatedExperiences[experienceIndex] = updatedExperience;
    
    // Mettre à jour le document
    await adminDb.collection('users').doc(resolvedParams.id).update({
      experiences: updatedExperiences
    });

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'expérience:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la modification de l\'expérience' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une expérience
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier que l'utilisateur modifie son propre profil
    if (session.user.id !== resolvedParams.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id: experienceId } = await request.json();
    
    if (!experienceId) {
      return NextResponse.json({ error: 'ID de l\'expérience requis' }, { status: 400 });
    }

    // Récupérer le profil Molt
    const moltDoc = await adminDb.collection('users').doc(resolvedParams.id).get();
    
    if (!moltDoc.exists) {
      return NextResponse.json({ error: 'Profil Molt non trouvé' }, { status: 404 });
    }

    const moltData = moltDoc.data() as IMolt;
    const currentExperiences = moltData.experiences || [];
    
    // Filtrer pour supprimer l'expérience
    const updatedExperiences = currentExperiences.filter(exp => 
      (exp as Experience & { id?: string }).id !== experienceId
    );
    
    if (updatedExperiences.length === currentExperiences.length) {
      return NextResponse.json({ error: 'Expérience non trouvée' }, { status: 404 });
    }
    
    // Mettre à jour le document
    await adminDb.collection('users').doc(resolvedParams.id).update({
      experiences: updatedExperiences
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'expérience:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de l\'expérience' },
      { status: 500 }
    );
  }
}