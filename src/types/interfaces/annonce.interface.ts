import { AnnonceType } from '@/types/enums/annonce-types.enum';

export interface IAnnonce {
  id?: string;
  date: Date;
  type: AnnonceType | string; // Support des anciens types en string pour compatibilité
  nomEtablissement: string;
  nomMetier: string;
  description: string;
  localisation: string;
  imageUrl?: string;
  mentorId: string;  // Référence à l'ID du mentor plutôt qu'à l'objet complet
  ceQueJePropose?: string;
  profilRecherche?: string;
}
