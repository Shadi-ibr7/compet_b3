import { IBaseUser } from './base-user.interface';

export interface IMentor extends IBaseUser {
  id?: string;           // ID unique du mentor
  role: "mentor";
  nom: string;           // Nom affiché du mentor
  job: string;           // Métier/profession
  localisation: string;  // Lieu de résidence
  description: string;   // Bio/présentation du mentor
  annonceId?: string;    // Référence à l'ID de l'annonce plutôt qu'à l'objet complet
}
