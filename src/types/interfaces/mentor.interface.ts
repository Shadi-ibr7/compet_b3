import { IBaseUser } from './base-user.interface';

export interface IMentor extends IBaseUser {
  role: "mentor";
  nom: string;           // Nom affiché du mentor
  job: string;           // Métier/profession
  localisation: string;  // Lieu de résidence
  description: string;   // Bio/présentation du mentor
  note?: number;         // Note fictive (pour l'instant)
  annonceId?: string;    // Référence à l'ID de l'annonce plutôt qu'à l'objet complet
}
