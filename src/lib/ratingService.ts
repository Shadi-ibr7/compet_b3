import type { IMentorRating, IRatingEligibility } from '@/types/interfaces/rating.interface';

/**
 * Récupère la note moyenne d'un mentor
 * @param mentorId - ID du mentor
 * @returns Promise<IMentorRating> - Données de notation du mentor
 */
export async function getMentorRating(mentorId: string): Promise<IMentorRating> {
  try {
    const response = await fetch(`/api/mentors/${mentorId}/rating`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erreur lors de la récupération de la note mentor:', response.status);
      // Retourner une note par défaut en cas d'erreur
      return {
        mentorId,
        averageRating: null,
        totalRatings: 0,
        ratings: []
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la note mentor:', error);
    // Retourner une note par défaut en cas d'erreur
    return {
      mentorId,
      averageRating: null,
      totalRatings: 0,
      ratings: []
    };
  }
}

/**
 * Vérifie si un Molt peut noter un mentor
 * @param moltId - ID du Molt
 * @param mentorId - ID du mentor
 * @returns Promise<IRatingEligibility> - Éligibilité à noter
 */
export async function checkRatingEligibility(
  moltId: string,
  mentorId: string
): Promise<IRatingEligibility> {
  try {
    const response = await fetch(`/api/ratings/check/${moltId}/${mentorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erreur lors de la vérification d\'éligibilité:', response.status);
      // Retourner un état par défaut en cas d'erreur (fail-safe)
      return {
        canRate: false,
        hasAlreadyRated: false,
        reason: 'Erreur lors de la vérification'
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la vérification d\'éligibilité:', error);
    // Retourner un état par défaut en cas d'erreur (fail-safe)
    return {
      canRate: false,
      hasAlreadyRated: false,
      reason: 'Erreur lors de la vérification'
    };
  }
}

/**
 * Crée une nouvelle note pour un mentor
 * @param mentorId - ID du mentor à noter
 * @param rating - Note de 1 à 5
 * @param comment - Commentaire optionnel
 * @returns Promise<boolean> - true si la note a été créée avec succès
 */
export async function createRating(
  mentorId: string,
  rating: number,
  comment?: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mentorId,
        rating,
        comment,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création de la note');
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la note:', error);
    throw error;
  }
}

/**
 * Formate l'affichage d'une note
 * @param averageRating - Note moyenne (peut être null)
 * @param totalRatings - Nombre total de notes
 * @returns string - Texte formaté pour l'affichage
 */
export function formatRatingDisplay(
  averageRating: number | null,
  totalRatings: number
): string {
  if (averageRating === null || totalRatings === 0) {
    return 'Nouveau mentor';
  }

  const ratingText = `${averageRating}/5`;
  const countText = totalRatings === 1 ? '1 avis' : `${totalRatings} avis`;
  
  return `${ratingText} (${countText})`;
}

/**
 * Génère des étoiles pour l'affichage visuel
 * @param rating - Note à afficher
 * @returns object - Étoiles pleines et vides
 */
export function generateStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return {
    fullStars,
    hasHalfStar,
    emptyStars,
    fullStarText: '★'.repeat(fullStars),
    halfStarText: hasHalfStar ? '☆' : '',
    emptyStarText: '☆'.repeat(emptyStars)
  };
}