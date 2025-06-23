import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import type { IRatingEligibility } from '@/types/interfaces/rating.interface';

interface RouteParams {
  params: {
    moltId: string;
    mentorId: string;
  };
}

// GET /api/ratings/check/[moltId]/[mentorId] - Vérifier éligibilité à noter
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { moltId, mentorId } = params;

    // Vérifier que l'utilisateur vérifie ses propres droits ou est admin
    if (session.user.id !== moltId && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Vérifier si candidature existe
    const applicationQuery = await adminDb
      .collection('applications')
      .where('moltId', '==', moltId)
      .where('mentorId', '==', mentorId)
      .limit(1)
      .get();

    if (applicationQuery.empty) {
      const eligibility: IRatingEligibility = {
        canRate: false,
        hasAlreadyRated: false,
        reason: 'Aucune candidature envoyée à ce mentor'
      };
      return NextResponse.json(eligibility);
    }

    const applicationId = applicationQuery.docs[0].id;

    // Vérifier si déjà noté
    const existingRatingQuery = await adminDb
      .collection('ratings')
      .where('moltId', '==', moltId)
      .where('mentorId', '==', mentorId)
      .limit(1)
      .get();

    const hasAlreadyRated = !existingRatingQuery.empty;

    // Vérifier si le Molt est premium
    const moltDoc = await adminDb.collection('users').doc(moltId).get();
    const moltData = moltDoc.data();
    const isPremium = moltData?.paid === true;

    const eligibility: IRatingEligibility = {
      canRate: isPremium && !hasAlreadyRated,
      hasAlreadyRated,
      applicationId,
      reason: !isPremium 
        ? 'Seuls les Molts premium peuvent noter'
        : hasAlreadyRated 
        ? 'Mentor déjà noté'
        : undefined
    };

    return NextResponse.json(eligibility);

  } catch (error) {
    console.error('Erreur lors de la vérification d\'éligibilité:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification d\'éligibilité' },
      { status: 500 }
    );
  }
}