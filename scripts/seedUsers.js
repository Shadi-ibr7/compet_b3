import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");

// Initialiser Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey,
  })
});

const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    // Créer un compte Admin
    const adminUser = await auth.createUser({
      email: 'admin2@molty.fr',
      password: 'AdminMolty2025!',
      displayName: 'Admin Molty'
    });

    await db.collection('users').doc(adminUser.uid).set({
      name: 'Admin Molty',
      linkPhoto: null,
      role: 'admin',
      dateCreation: new Date(),
      email: 'admin2@molty.fr',
      permissions: ['create_article', 'edit_article', 'delete_article', 'manage_users']
    });

    console.log('Admin user created:', adminUser.uid);

  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

createAdminUser()
  .then(() => console.log('Admin user created successfully'))
  .catch(console.error);
