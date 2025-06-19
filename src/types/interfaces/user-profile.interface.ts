import { UserRole } from '../common';

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  location?: string;
  phone?: string;
  memberSince?: string;
  motivation?: string;
  skills?: string[];
  relationshipSkills?: string[];
  otherResources?: string[];
} 