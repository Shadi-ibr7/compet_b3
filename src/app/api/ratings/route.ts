import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/credentials-config';
import { securityMiddleware } from '@/lib/middleware/security';
import { adminDb } from '@/lib/firebase-admin';
import type { IRating } from '@/types/interfaces/rating.interface';

// POST /api/ratings - Créer une nouvelle note
export async function POST(request: NextRequest) {
  return securityMiddleware(
    request,
    async (req: NextRequest, sanitizedBody?: Record<string, unknown>) => {
      try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
          return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        if (session.user.role !== 'molt') {
          return NextResponse.json({ error: 'Seuls les Molts peuvent noter' }, { status: 403 });
        }

        // Utiliser les données sanitisées par le middleware
        const { mentorId, rating, comment } = sanitizedBody || {};

        if (!mentorId || !rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
          return NextResponse.json(
            { error: 'mentorId et rating (1-5) sont requis' },
            { status: 400 }
          );
        }

        // Vérifier que le mentor existe
        const mentorDoc = await adminDb.collection('mentors').doc(mentorId as string).get();
        if (!mentorDoc.exists) {
          return NextResponse.json(
            { error: 'Mentor non trouvé' },
            { status: 404 }
          );
        }

        // Vérifier que l'utilisateur est premium
        const moltDoc = await adminDb.collection('users').doc(session.user.id).get();
        const moltData = moltDoc.data();
        
        if (!moltData?.paid) {
          return NextResponse.json(
            { error: 'Seuls les Molts premium peuvent noter' },
            { status: 403 }
          );
        }

        // Vérifier qu'une candidature existe entre le Molt et le Mentor
        const applicationQuery = await adminDb
          .collection('applications')
          .where('moltId', '==', session.user.id)
          .where('mentorId', '==', mentorId)
          .limit(1)
          .get();

        if (applicationQuery.empty) {
          return NextResponse.json(
            { error: 'Vous devez avoir postulé à une annonce de ce mentor pour pouvoir le noter' },
            { status: 403 }
          );
        }

        const applicationId = applicationQuery.docs[0].id;

        // Vérifier qu'aucune note n'existe déjà
        const existingRatingQuery = await adminDb
          .collection('ratings')
          .where('moltId', '==', session.user.id)
          .where('mentorId', '==', mentorId)
          .limit(1)
          .get();

        if (!existingRatingQuery.empty) {
          return NextResponse.json(
            { error: 'Vous avez déjà noté ce mentor' },
            { status: 409 }
          );
        }

        // Créer la nouvelle note
        const ratingData: Omit<IRating, 'id'> = {
          moltId: session.user.id,
          mentorId: mentorId as string,
          applicationId,
          rating: Math.round(rating as number), // S'assurer que c'est un entier
          comment: comment ? String(comment).trim() || undefined : undefined,
          dateCreated: new Date()
        };

        const docRef = await adminDb
          .collection('ratings')
          .add(ratingData);

        const newRating: IRating = {
          id: docRef.id,
          ...ratingData
        };

        return NextResponse.json({ rating: newRating }, { status: 201 });

      } catch (error) {
        console.error('Erreur lors de la création de la note:', error);
        return NextResponse.json(
          { error: 'Erreur lors de la création de la note' },
          { status: 500 }
        );
      }
    },
    {
      requireAuth: true,
      allowedRoles: ['molt'],
    }
  );
}