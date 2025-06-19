import { Timestamp } from 'firebase-admin/firestore';

export interface FirestoreAnnonce {
  id?: string;
  date: Timestamp;
  localisation: string;
  description: string;
  mentorId: string;
}
