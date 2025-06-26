import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { securityMiddleware } from '@/lib/middleware/security';

const db = adminDb;

export async function POST(request: NextRequest) {
  return securityMiddleware(
    request,
    async (req: NextRequest, sanitizedBody?: Record<string, unknown>) => {
      try {
        const { type, nomEtablissement, nomMetier, description, localisation, imageUrl, ceQueJePropose, profilRecherche } = sanitizedBody || {};

        // Validation des champs requis
        if (!type || !nomEtablissement || !nomMetier || !description || !localisation) {
          return NextResponse.json(
            { error: 'Tous les champs obligatoires doivent être remplis' },
            { status: 400 }
          );
        }

        // Récupérer la session depuis le middleware
        const { getServerSession } = await import('next-auth');
        const { authOptions } = await import('@/lib/auth/credentials-config');
        const session = await getServerSession(authOptions);

        // Vérifier si le mentor a déjà une annonce
        const existingAnnonce = await db.collection('annonces')
          .where('mentorId', '==', session?.user?.id)
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
          type,
          nomEtablissement,
          nomMetier,
          description,
          localisation,
          imageUrl: imageUrl || null,
          mentorId: session?.user?.id,
          date: Timestamp.fromDate(new Date()),
          ceQueJePropose: ceQueJePropose || null,
          profilRecherche: profilRecherche || null,
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
    },
    {
      requireAuth: true,
      allowedRoles: ['mentor']
    }
  );
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
