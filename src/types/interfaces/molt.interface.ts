import { Experience } from '../common';
import { IBaseUser } from './base-user.interface';

export interface IMolt extends IBaseUser {
  role: "molt";
  paid: boolean;
  linkedin: string;
  experiences: Experience[];
}
