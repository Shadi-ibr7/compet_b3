import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

interface RouteParams {
  params: Promise<{
    moltId: string;
    annonceId: string;
  }>;
}

// GET /api/applications/check/[moltId]/[annonceId] - Vérifier si candidature existe
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { moltId, annonceId } = await params;

    // Vérifier que l'utilisateur vérifie ses propres candidatures ou est mentor/admin
    if (session.user.id !== moltId && !['mentor', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Vérifier si candidature existe
    const applicationQuery = await adminDb
      .collection('applications')
      .where('moltId', '==', moltId)
      .where('annonceId', '==', annonceId)
      .limit(1)
      .get();

    const hasApplied = !applicationQuery.empty;
    let application = null;

    if (hasApplied) {
      const doc = applicationQuery.docs[0];
      application = {
        id: doc.id,
        ...doc.data(),
        applicationDate: doc.data().applicationDate.toDate(),
      };
    }

    return NextResponse.json({ 
      hasApplied,
      application: hasApplied ? application : null
    });

  } catch (error) {
    console.error('Erreur lors de la vérification de candidature:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification de candidature' },
      { status: 500 }
    );
  }
}