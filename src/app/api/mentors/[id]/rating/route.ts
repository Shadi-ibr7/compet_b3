import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import type { IMentorRating, IRating } from '@/types/interfaces/rating.interface';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/mentors/[id]/rating - Obtenir la note moyenne d'un mentor
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: mentorId } = await params;

    // Récupérer toutes les notes du mentor
    const ratingsQuery = await adminDb
      .collection('ratings')
      .where('mentorId', '==', mentorId)
      .get();

    if (ratingsQuery.empty) {
      const mentorRating: IMentorRating = {
        mentorId,
        averageRating: null,
        totalRatings: 0,
        ratings: []
      };
      return NextResponse.json(mentorRating);
    }

    // Calculer la moyenne et trier côté application
    const ratings = (ratingsQuery.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        dateCreated: doc.data().dateCreated.toDate(),
      })) as IRating[])
      .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = Math.round((totalRating / ratings.length) * 10) / 10; // 1 décimale

    const mentorRating: IMentorRating = {
      mentorId,
      averageRating,
      totalRatings: ratings.length,
      ratings
    };

    return NextResponse.json(mentorRating);

  } catch (error) {
    console.error('Erreur lors du calcul de la note mentor:', error);
    return NextResponse.json(
      { error: 'Erreur lors du calcul de la note mentor' },
      { status: 500 }
    );
  }
}