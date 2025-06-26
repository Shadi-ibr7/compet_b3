import { UserRole } from '../common';

export interface IBaseUser {
  id?: string;
  name: string;
  linkPhoto: string;
  email: string;
  role: UserRole;
  dateCreation: Date;
}
