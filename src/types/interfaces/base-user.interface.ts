import { UserRole } from '../common';

export interface IBaseUser {
  name: string;
  linkPhoto: string;
  number: string;
  role: UserRole;
  dateCreation: Date;
}
