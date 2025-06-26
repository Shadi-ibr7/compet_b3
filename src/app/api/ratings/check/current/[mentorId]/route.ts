import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/credentials-config';
import { securityMiddleware } from '@/lib/middleware/security';
import { adminDb } from '@/lib/firebase-admin';
import type { IRatingEligibility } from '@/types/interfaces/rating.interface';

// GET /api/ratings/check/current/[mentorId] - Vérifier l'éligibilité pour noter
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mentorId: string }> }
) {
  return securityMiddleware(
    request,
    async (req: NextRequest) => {
      try {
        // La session est déjà vérifiée par le middleware, récupérer les données
        const session = await getServerSession(authOptions);
        const resolvedParams = await params;
        
        // Le middleware a déjà vérifié l'auth et le rôle, utiliser directement la session
        const moltId = session!.user.id;
        const { mentorId } = resolvedParams;

        // Vérifier que le mentor existe
        const mentorDoc = await adminDb.collection('mentors').doc(mentorId).get();
        if (!mentorDoc.exists) {
          const eligibility: IRatingEligibility = {
            canRate: false,
            hasAlreadyRated: false,
            reason: 'Mentor non trouvé'
          };
          return NextResponse.json(eligibility);
        }

        // Vérifier que l'utilisateur est premium
        const moltDoc = await adminDb.collection('users').doc(moltId).get();
        const moltData = moltDoc.data();
        
        if (!moltData?.paid) {
          const eligibility: IRatingEligibility = {
            canRate: false,
            hasAlreadyRated: false,
            reason: 'Seuls les Molts premium peuvent noter les mentors'
          };
          return NextResponse.json(eligibility);
        }

        // Vérifier qu'une candidature existe entre le Molt et le Mentor
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
            reason: 'Vous devez avoir postulé à une annonce de ce mentor pour pouvoir le noter'
          };
          return NextResponse.json(eligibility);
        }

        const applicationId = applicationQuery.docs[0].id;

        // Vérifier qu'aucune note n'existe déjà
        const existingRatingQuery = await adminDb
          .collection('ratings')
          .where('moltId', '==', moltId)
          .where('mentorId', '==', mentorId)
          .limit(1)
          .get();

        if (!existingRatingQuery.empty) {
          const eligibility: IRatingEligibility = {
            canRate: false,
            hasAlreadyRated: true,
            applicationId,
            reason: 'Vous avez déjà noté ce mentor'
          };
          return NextResponse.json(eligibility);
        }

        // L'utilisateur peut noter
        const eligibility: IRatingEligibility = {
          canRate: true,
          hasAlreadyRated: false,
          applicationId,
          reason: undefined
        };

        return NextResponse.json(eligibility);

      } catch (error) {
        console.error('Erreur lors de la vérification d\'éligibilité:', error);
        
        // Retourner un état par défaut en cas d'erreur (fail-safe)
        const eligibility: IRatingEligibility = {
          canRate: false,
          hasAlreadyRated: false,
          reason: 'Erreur lors de la vérification d\'éligibilité'
        };
        
        return NextResponse.json(eligibility, { status: 500 });
      }
    },
    {
      requireAuth: true,
      allowedRoles: ['molt'],
    }
  );
}