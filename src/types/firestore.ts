import { Timestamp } from 'firebase-admin/firestore';

export interface FirestoreAnnonce {
  id?: string;
  date: Timestamp;
  type: string;
  nomEtablissement: string;
  nomMetier: string;
  description: string;
  localisation: string;
  imageUrl?: string;
  mentorId: string;
}
