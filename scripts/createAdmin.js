import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
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

// Admin credentials
const ADMIN_EMAIL = 'admin@molty.fr';
const ADMIN_PASSWORD = 'Admin123!';
const ADMIN_NAME = 'Admin Molty';

async function createAdmin() {
  console.log('🚀 CRÉATION DU COMPTE ADMIN');
  console.log('============================\n');
  
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    const app = initializeApp({
      credential: cert(serviceAccount)
    });

    const db = getFirestore(app);
    const auth = getAuth(app);
    
    console.log(`📡 Connecté au projet Firebase: ${process.env.PROJECT_ID}\n`);

    // Check if admin already exists
    try {
      const existingUser = await auth.getUserByEmail(ADMIN_EMAIL);
      console.log('⚠️  Un admin avec cet email existe déjà');
      console.log(`📧 Email: ${ADMIN_EMAIL}`);
      console.log(`🔑 Mot de passe: ${ADMIN_PASSWORD}`);
      console.log(`🆔 UID: ${existingUser.uid}\n`);
      
      // Update the user document in Firestore to ensure admin role
      await db.collection('users').doc(existingUser.uid).set({
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        role: 'admin',
        image: '/admin-avatar.png',
        city: 'Paris, France',
        jobTitle: 'Administrateur Plateforme',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        emailVerified: Timestamp.now()
      });
      
      console.log('✅ Document admin mis à jour dans Firestore');
      console.log('🎯 Le compte admin est prêt à être utilisé !');
      
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new admin user
        console.log('👤 Création du nouvel admin...');
        
        const userRecord = await auth.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          displayName: ADMIN_NAME,
          emailVerified: true
        });

        console.log(`✅ Utilisateur admin créé avec UID: ${userRecord.uid}`);

        // Create admin document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          role: 'admin',
          image: '/admin-avatar.png',
          city: 'Paris, France',
          jobTitle: 'Administrateur Plateforme',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          emailVerified: Timestamp.now()
        });

        console.log('✅ Document admin créé dans Firestore');
        console.log('\n🎉 ADMIN CRÉÉ AVEC SUCCÈS !');
      } else {
        throw error;
      }
    }

    // Display final credentials
    console.log('\n📋 IDENTIFIANTS ADMIN');
    console.log('=====================');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Mot de passe: ${ADMIN_PASSWORD}`);
    console.log(`👤 Nom: ${ADMIN_NAME}`);
    console.log(`🏢 Rôle: admin`);
    console.log('\n🔗 Connexion: http://localhost:3000/auth/signin');
    console.log('💡 Utilisez ces identifiants pour vous connecter en tant qu\'admin\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('💥 ERREUR lors de la création de l\'admin:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

createAdmin();