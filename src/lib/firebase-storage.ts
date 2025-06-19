import { getStorage } from 'firebase-admin/storage';
// L'app est déjà initialisée dans firebase-admin.ts
export const adminStorage = getStorage();
