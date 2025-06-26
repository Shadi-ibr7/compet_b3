import { initializeApp, cert } from 'firebase-admin/app';
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

// Sample mentors data
const sampleMentors = [
  {
    id: 'mentor-sophie-martin',
    nom: 'Sophie Martin',
    job: 'Épicière fine & Conseillère en produits du terroir',
    localisation: 'Lyon, France',
    description: 'Passionnée par les produits du terroir, je vous aide à créer votre épicerie fine. 15 ans d\'expérience dans la sélection de produits artisanaux et l\'accompagnement client personnalisé.',
    role: 'mentor',
    name: 'Sophie Martin',
    email: 'sophie.martin@epicerie-terroir.fr',
    dateCreation: new Date(),
    linkPhoto: '/image2.png'
  },
  {
    id: 'mentor-paul-dubois',
    nom: 'Paul Dubois',
    job: 'Boulanger artisanal & Formateur',
    localisation: 'Bordeaux, France',
    description: 'Maître boulanger depuis 20 ans, je forme les futurs artisans boulangers. Spécialisé dans les pains biologiques et les techniques traditionnelles. Je vous accompagne dans la création de votre boulangerie.',
    role: 'mentor',
    name: 'Paul Dubois',
    email: 'paul.dubois@boulangerie-artisanale.fr',
    dateCreation: new Date(),
    linkPhoto: '/image2.png'
  },
  {
    id: 'mentor-marie-leroy',
    nom: 'Marie Leroy',
    job: 'Fleuriste créatrice & Coach en entrepreneuriat',
    localisation: 'Marseille, France',
    description: 'Créatrice florale et coach en entrepreneuriat, j\'aide les passionnés de fleurs à lancer leur activité. Expertise en création de bouquets sur-mesure et développement commercial local.',
    role: 'mentor',
    name: 'Marie Leroy',
    email: 'marie.leroy@fleurs-creation.fr',
    dateCreation: new Date(),
    linkPhoto: '/image2.png'
  }
];

async function seedMentors() {
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    initializeApp({
      credential: cert(serviceAccount)
    });

    const db = getFirestore();
    
    console.log('🚀 Début du seeding des mentors...');

    // Add each mentor to Firestore
    for (const mentor of sampleMentors) {
      const { id, ...mentorData } = mentor;
      
      console.log(`📝 Ajout du mentor: ${mentorData.nom}`);
      
      // Check if mentor already exists
      const existingMentor = await db.collection('mentors').doc(id).get();
      
      if (existingMentor.exists) {
        console.log(`⚠️  Le mentor ${mentorData.nom} existe déjà, mise à jour...`);
        await db.collection('mentors').doc(id).update(mentorData);
      } else {
        console.log(`✨ Création du nouveau mentor: ${mentorData.nom}`);
        await db.collection('mentors').doc(id).set(mentorData);
      }
    }

    console.log('✅ Seeding des mentors terminé avec succès!');
    console.log(`📊 ${sampleMentors.length} mentors ajoutés/mis à jour`);
    
    // Get final count
    const mentorsSnapshot = await db.collection('mentors').get();
    console.log(`🎯 Total des mentors en base: ${mentorsSnapshot.size}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des mentors:', error);
    process.exit(1);
  }
}

seedMentors();