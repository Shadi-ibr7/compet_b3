import { UserRole } from '../common';

export interface IBaseUser {
  id?: string;
  name: string;
  linkPhoto: string;
  number: string;
  role: UserRole;
  dateCreation: Date;
}
