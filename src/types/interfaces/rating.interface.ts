export interface IRating {
  id?: string;
  moltId: string;       // Qui note
  mentorId: string;     // Qui est noté  
  applicationId: string; // Référence à la candidature qui donne le droit
  rating: number;       // Note 1-5
  comment?: string;     // Commentaire optionnel
  dateCreated: Date;    // Date de notation
}

export interface IMentorRating {
  mentorId: string;
  averageRating: number | null;
  totalRatings: number;
  ratings: IRating[];
}

export interface IRatingEligibility {
  canRate: boolean;
  hasAlreadyRated: boolean;
  applicationId?: string;
  reason?: string;
}