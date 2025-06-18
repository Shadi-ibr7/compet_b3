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

async function createTestUsers() {
  try {
    // Créer un compte Molt
    const moltUser = await auth.createUser({
      email: 'molt@test.com',
      password: 'testpass123',
      displayName: 'Test Molt'
    });

    await db.collection('users').doc(moltUser.uid).set({
      name: 'Test Molt',
      linkPhoto: 'https://example.com/photo.jpg',
      number: '+33123456789',
      role: 'molt',
      dateCreation: new Date(),
      paid: true,
      linkedin: 'https://linkedin.com/in/testmolt',
      experiences: [
        {
          type: 'education',
          institution: 'Test University',
          startDate: '2020-09-01',
          endDate: '2023-06-30'
        },
        {
          type: 'pro',
          institution: 'Test Company',
          position: 'Developer',
          startDate: '2023-07-01'
        }
      ]
    });

    console.log('Molt user created:', moltUser.uid);

    // Créer un compte Mentor
    const mentorUser = await auth.createUser({
      email: 'mentor@test.com',
      password: 'testpass123',
      displayName: 'Test Mentor'
    });

    await db.collection('users').doc(mentorUser.uid).set({
      name: 'Test Mentor',
      linkPhoto: 'https://example.com/mentor.jpg',
      number: '+33987654321',
      role: 'mentor',
      dateCreation: new Date(),
      domain: 'Web Development',
      note: 4.5,
      annonceId: null
    });

    console.log('Mentor user created:', mentorUser.uid);

  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

createTestUsers()
  .then(() => console.log('Test users created successfully'))
  .catch(console.error);
