export type ApplicationStatus = 'sent' | 'viewed' | 'responded';

export interface IApplication {
  id?: string;
  moltId: string;        // ID du Molt candidat
  annonceId: string;     // ID de l'annonce
  mentorId: string;      // ID du mentor (pour indexation)
  applicationDate: Date; // Date de candidature
  customMessage?: string; // Message personnalisé
  status?: ApplicationStatus; // Statut de la candidature
}