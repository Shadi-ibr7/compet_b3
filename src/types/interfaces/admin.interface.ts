import { IBaseUser } from './base-user.interface';

export interface IAdmin extends IBaseUser {
  role: "admin";
  articleIds: string[];  // Références aux IDs des articles plutôt qu'aux objets complets
}
