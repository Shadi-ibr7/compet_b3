import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Firebase Admin configuration
const serviceAccount = {
  projectId: process.env.PROJECT_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
};

async function createTestAccount() {
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    initializeApp({
      credential: cert(serviceAccount)
    });

    const auth = getAuth();
    const db = getFirestore();
    
    console.log('🚀 Création d\'un compte de test...');

    // Compte mentor de test
    const mentorEmail = 'mentor.test@molty.fr';
    const mentorPassword = 'TestMentor123!';
    const mentorName = 'Mentor Test';

    // Compte molt de test
    const moltEmail = 'molt.test@molty.fr';
    const moltPassword = 'TestMolt123!';
    const moltName = 'Molt Test';

    try {
      // Supprimer les comptes existants s'ils existent
      try {
        const existingMentor = await auth.getUserByEmail(mentorEmail);
        await auth.deleteUser(existingMentor.uid);
        console.log('🗑️ Ancien compte mentor supprimé');
      } catch (e) {
        // Compte n'existe pas, c'est normal
      }

      try {
        const existingMolt = await auth.getUserByEmail(moltEmail);
        await auth.deleteUser(existingMolt.uid);
        console.log('🗑️ Ancien compte molt supprimé');
      } catch (e) {
        // Compte n'existe pas, c'est normal
      }

      // Créer le compte mentor
      console.log('👨‍💼 Création du compte mentor...');
      const mentorUser = await auth.createUser({
        email: mentorEmail,
        password: mentorPassword,
        displayName: mentorName,
      });

      await db.collection('users').doc(mentorUser.uid).set({
        email: mentorEmail,
        name: mentorName,
        role: 'mentor',
        status: 'active',
        createdAt: new Date().toISOString(),
        emailVerified: true,
        linkPhoto: '',
        address: '',
        city: 'Paris, France',
        cvUrl: ''
      });

      console.log(`✅ Compte mentor créé: ${mentorEmail} / ${mentorPassword}`);

      // Créer le compte molt
      console.log('👤 Création du compte molt...');
      const moltUser = await auth.createUser({
        email: moltEmail,
        password: moltPassword,
        displayName: moltName,
      });

      await db.collection('users').doc(moltUser.uid).set({
        email: moltEmail,
        name: moltName,
        role: 'molt',
        status: 'unpaid',
        createdAt: new Date().toISOString(),
        emailVerified: true,
        linkPhoto: '',
        address: '',
        city: 'Lyon, France',
        cvUrl: ''
      });

      // Créer aussi un profil molt complet
      await db.collection('molts').doc(moltUser.uid).set({
        id: moltUser.uid,
        name: moltName,
        email: moltEmail,
        role: 'molt',
        paid: true, // On le rend premium pour pouvoir tester
        linkedin: 'https://linkedin.com/in/molt-test',
        city: 'Lyon, France',
        jobTitle: 'Développeur Test',
        motivation: 'Je suis un compte de test pour valider le système d\'email',
        dateCreation: new Date(),
        linkPhoto: '',
        experiences: [
          {
            type: 'pro',
            institution: 'Test Corp',
            position: 'Développeur Test',
            startDate: '2023-01-01',
            endDate: '2024-12-31'
          }
        ]
      });

      console.log(`✅ Compte molt créé: ${moltEmail} / ${moltPassword}`);

      console.log('\n🎯 COMPTES DE TEST CRÉÉS:');
      console.log('==========================================');
      console.log('👨‍💼 MENTOR:');
      console.log(`   Email: ${mentorEmail}`);
      console.log(`   Password: ${mentorPassword}`);
      console.log(`   UID: ${mentorUser.uid}`);
      console.log('');
      console.log('👤 MOLT (Premium):');
      console.log(`   Email: ${moltEmail}`);
      console.log(`   Password: ${moltPassword}`);
      console.log(`   UID: ${moltUser.uid}`);
      console.log('==========================================');
      console.log('');
      console.log('📋 PROCÉDURE DE TEST:');
      console.log('1. Connectez-vous avec le compte mentor');
      console.log('2. Créez une annonce depuis le dashboard');
      console.log('3. Déconnectez-vous et connectez-vous avec le compte molt');
      console.log('4. Postulez à l\'annonce créée');
      console.log('5. Vérifiez les logs dans la console pour le debug');

    } catch (error) {
      console.error('❌ Erreur lors de la création des comptes:', error);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    process.exit(1);
  }
}

createTestAccount();