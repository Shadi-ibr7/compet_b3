import { IBaseUser } from './base-user.interface';

export interface IMentor extends IBaseUser {
  role: "mentor";
  domain: string;
  note?: number;
  annonceId?: string;  // Référence à l'ID de l'annonce plutôt qu'à l'objet complet
}
