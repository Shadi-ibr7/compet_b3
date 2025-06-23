import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import type { IApplication } from '@/types/interfaces/application.interface';

// GET /api/applications - Récupérer les candidatures d'un Molt
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (session.user.role !== 'molt') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const annonceId = searchParams.get('annonceId');

    // Si annonceId fourni, vérifier candidature spécifique
    if (annonceId) {
      const applicationQuery = await adminDb
        .collection('applications')
        .where('moltId', '==', session.user.id)
        .where('annonceId', '==', annonceId)
        .limit(1)
        .get();

      const hasApplied = !applicationQuery.empty;
      return NextResponse.json({ hasApplied });
    }

    // Sinon, récupérer toutes les candidatures du Molt
    const applicationsQuery = await adminDb
      .collection('applications')
      .where('moltId', '==', session.user.id)
      .orderBy('applicationDate', 'desc')
      .get();

    const applications: IApplication[] = applicationsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      applicationDate: doc.data().applicationDate.toDate(),
    })) as IApplication[];

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des candidatures' },
      { status: 500 }
    );
  }
}

// POST /api/applications - Créer une nouvelle candidature
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (session.user.role !== 'molt') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const { annonceId, mentorId, customMessage } = body;

    if (!annonceId || !mentorId) {
      return NextResponse.json(
        { error: 'annonceId et mentorId sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si candidature existe déjà
    const existingApplicationQuery = await adminDb
      .collection('applications')
      .where('moltId', '==', session.user.id)
      .where('annonceId', '==', annonceId)
      .limit(1)
      .get();

    if (!existingApplicationQuery.empty) {
      return NextResponse.json(
        { error: 'Candidature déjà envoyée pour cette annonce' },
        { status: 409 }
      );
    }

    // Créer la nouvelle candidature
    const applicationData: Omit<IApplication, 'id'> = {
      moltId: session.user.id,
      annonceId,
      mentorId,
      applicationDate: new Date(),
      customMessage: customMessage || undefined,
      status: 'sent'
    };

    const docRef = await adminDb
      .collection('applications')
      .add(applicationData);

    const application: IApplication = {
      id: docRef.id,
      ...applicationData
    };

    return NextResponse.json({ application }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la candidature:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la candidature' },
      { status: 500 }
    );
  }
}