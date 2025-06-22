import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/credentials-config';
import { adminDb } from '@/lib/firebase-admin';
import type { IMolt } from '@/types/interfaces/molt.interface';

// GET - Récupérer un profil Molt
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier que l'utilisateur accède à son propre profil
    if (session.user.id !== resolvedParams.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const moltDoc = await adminDb.collection('users').doc(resolvedParams.id).get();
    
    if (!moltDoc.exists) {
      return NextResponse.json({ error: 'Profil Molt non trouvé' }, { status: 404 });
    }

    const moltData = moltDoc.data() as IMolt;
    
    // Vérifier que c'est bien un utilisateur Molt
    if (moltData.role !== 'molt') {
      return NextResponse.json({ error: 'Utilisateur non Molt' }, { status: 400 });
    }

    // Convertir les timestamps Firestore en dates ISO pour le frontend
    // Utiliser dateCreation en priorité, sinon createdAt comme fallback
    const originalDate = moltData.dateCreation || (moltData as { createdAt?: string }).createdAt;
    let convertedDate;
    
    if (originalDate instanceof Date) {
      convertedDate = originalDate.toISOString();
    } else if ((originalDate as { toDate?: () => Date })?.toDate) {
      convertedDate = (originalDate as { toDate: () => Date }).toDate().toISOString();
    } else if (typeof originalDate === 'string') {
      convertedDate = originalDate;
    } else {
      convertedDate = new Date().toISOString();
    }
    
    const formattedMoltData = {
      ...moltData,
      dateCreation: convertedDate
    };

    return NextResponse.json(formattedMoltData);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil Molt:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un profil Molt
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

    const updateData = await request.json();
    
    // Validation des données
    const sanitizedData: Partial<IMolt> = {};
    
    if (typeof updateData.name === 'string') {
      sanitizedData.name = updateData.name.trim();
    }
    if (typeof updateData.linkedin === 'string') {
      sanitizedData.linkedin = updateData.linkedin.trim();
    }
    if (typeof updateData.city === 'string') {
      sanitizedData.city = updateData.city.trim();
    }
    if (typeof updateData.jobTitle === 'string') {
      sanitizedData.jobTitle = updateData.jobTitle.trim();
    }
    if (typeof updateData.motivation === 'string') {
      sanitizedData.motivation = updateData.motivation.trim();
    }
    if (typeof updateData.linkPhoto === 'string') {
      sanitizedData.linkPhoto = updateData.linkPhoto.trim();
    }

    // Validation du nom (requis)
    if (sanitizedData.name !== undefined && !sanitizedData.name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    // Validation URL LinkedIn si fournie
    if (sanitizedData.linkedin) {
      const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
      if (!linkedinRegex.test(sanitizedData.linkedin)) {
        return NextResponse.json(
          { error: 'Format d\'URL LinkedIn invalide' },
          { status: 400 }
        );
      }
    }

    // Vérifier si le document existe
    const moltDoc = await adminDb.collection('users').doc(resolvedParams.id).get();
    
    if (!moltDoc.exists) {
      // Créer un nouveau profil Molt si n'existe pas
      const newMoltProfile: IMolt = {
        id: resolvedParams.id,
        name: sanitizedData.name || session.user.name || '',
        linkPhoto: sanitizedData.linkPhoto || session.user.image || '',
        email: session.user.email || '',
        role: 'molt',
        dateCreation: new Date(),
        paid: false,
        linkedin: sanitizedData.linkedin || '',
        experiences: [],
        city: sanitizedData.city || '',
        jobTitle: sanitizedData.jobTitle || '',
        motivation: sanitizedData.motivation || ''
      };

      await adminDb.collection('users').doc(resolvedParams.id).set(newMoltProfile);
      return NextResponse.json(newMoltProfile);
    }

    // Mettre à jour le profil existant
    await adminDb.collection('users').doc(resolvedParams.id).update(sanitizedData);
    
    // Récupérer le profil mis à jour
    const updatedDoc = await adminDb.collection('users').doc(resolvedParams.id).get();
    const updatedData = updatedDoc.data() as IMolt;

    // Convertir les timestamps Firestore en dates ISO pour le frontend
    const originalUpdatedDate = updatedData.dateCreation || (updatedData as { createdAt?: string }).createdAt;
    let convertedUpdatedDate;
    
    if (originalUpdatedDate instanceof Date) {
      convertedUpdatedDate = originalUpdatedDate.toISOString();
    } else if ((originalUpdatedDate as { toDate?: () => Date })?.toDate) {
      convertedUpdatedDate = (originalUpdatedDate as { toDate: () => Date }).toDate().toISOString();
    } else if (typeof originalUpdatedDate === 'string') {
      convertedUpdatedDate = originalUpdatedDate;
    } else {
      convertedUpdatedDate = new Date().toISOString();
    }
    
    const formattedUpdatedData = {
      ...updatedData,
      dateCreation: convertedUpdatedDate
    };

    return NextResponse.json(formattedUpdatedData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil Molt:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}