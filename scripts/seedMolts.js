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

// Sample Molts data avec profils complets
const sampleMolts = [
  {
    id: 'molt-nathaniel-test',
    name: 'Nathaniel Moreau',
    role: 'molt',
    paid: true,
    email: 'nathaniel.moreau@email.fr',
    city: 'Saint-Pierre, France',
    jobTitle: 'Développeur Full-Stack',
    motivation: 'Passionné par le développement web et les nouvelles technologies, je souhaite rejoindre une équipe créative pour développer des projets innovants. Mon expérience en React et Node.js me permet de contribuer efficacement aux projets modernes.',
    linkedin: 'https://linkedin.com/in/nathaniel-moreau',
    dateCreation: new Date(),
    linkPhoto: '/placeholder_pp.png',
    experiences: [
      {
        type: 'pro',
        institution: 'TechCorp',
        position: 'Développeur Frontend React',
        startDate: '2022-01-15',
        endDate: '2023-12-31'
      },
      {
        type: 'pro',
        institution: 'StartupXYZ',
        position: 'Développeur Backend Node.js',
        startDate: '2024-01-01'
      }
    ]
  },
  {
    id: 'molt-clara-martin',
    name: 'Clara Martin',
    role: 'molt',
    paid: true,
    email: 'clara.martin@email.fr',
    city: 'Lyon, France',
    jobTitle: 'Designer UX/UI',
    motivation: 'Créatrice passionnée par l\'expérience utilisateur, je cherche à rejoindre une équipe où je peux allier créativité et impact utilisateur. Mon approche centrée sur l\'humain me permet de créer des interfaces intuitives et engageantes.',
    linkedin: 'https://linkedin.com/in/clara-martin-ux',
    dateCreation: new Date(),
    linkPhoto: '/placeholder_pp.png',
    experiences: [
      {
        type: 'pro',
        institution: 'TechCorp',
        position: 'UX Designer',
        startDate: '2021-03-01',
        endDate: '2023-08-31'
      },
      {
        type: 'pro',
        institution: 'Freelance',
        position: 'UI Designer',
        startDate: '2023-09-01'
      }
    ]
  },
  {
    id: 'molt-julien-dubois',
    name: 'Julien Dubois',
    role: 'molt',
    paid: true,
    email: 'julien.dubois@email.fr',
    city: 'Bordeaux, France',
    jobTitle: 'Chef de Projet Digital',
    motivation: 'Fort de 5 ans d\'expérience en gestion de projets digitaux, je souhaite mettre mes compétences au service de projets innovants. Ma capacité à coordonner les équipes et à respecter les délais fait de moi un atout pour vos projets.',
    linkedin: 'https://linkedin.com/in/julien-dubois-pm',
    dateCreation: new Date(),
    linkPhoto: '/placeholder_pp.png',
    experiences: [
      {
        type: 'pro',
        institution: 'Agence360',
        position: 'Chef de Projet Web',
        startDate: '2020-06-01',
        endDate: '2023-05-31'
      },
      {
        type: 'pro',
        institution: 'DigitalStart',
        position: 'Product Owner Junior',
        startDate: '2023-06-01'
      }
    ]
  },
  {
    id: 'molt-sophie-bernard',
    name: 'Sophie Bernard',
    role: 'molt',
    paid: false, // Exemple d'utilisateur non premium
    email: 'sophie.bernard@email.fr',
    city: 'Marseille, France',
    jobTitle: 'Développeuse Mobile',
    motivation: 'Spécialisée dans le développement mobile natif et hybride, je cherche de nouvelles opportunités pour créer des applications impactantes. Mon expertise en Flutter et React Native me permet de développer des solutions cross-platform efficaces.',
    linkedin: 'https://linkedin.com/in/sophie-bernard-mobile',
    dateCreation: new Date(),
    linkPhoto: '/placeholder_pp.png',
    experiences: [
      {
        type: 'pro',
        institution: 'MobileTech',
        position: 'Développeuse Flutter',
        startDate: '2022-09-01',
        endDate: '2024-03-31'
      },
      {
        type: 'pro',
        institution: 'Freelance',
        position: 'Développeuse React Native',
        startDate: '2024-04-01'
      }
    ]
  }
];

async function seedMolts() {
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    initializeApp({
      credential: cert(serviceAccount)
    });

    const db = getFirestore();
    
    console.log('🚀 Début du seeding des Molts...');

    // Add each Molt to Firestore
    for (const molt of sampleMolts) {
      const { id, ...moltData } = molt;
      
      console.log(`📝 Ajout du Molt: ${moltData.name} (${moltData.city})`);
      
      // Check if Molt already exists
      const existingMolt = await db.collection('molts').doc(id).get();
      
      if (existingMolt.exists) {
        console.log(`⚠️  Le Molt ${moltData.name} existe déjà, mise à jour...`);
        await db.collection('molts').doc(id).update(moltData);
      } else {
        console.log(`✨ Création du nouveau Molt: ${moltData.name}`);
        await db.collection('molts').doc(id).set(moltData);
      }
    }

    console.log('✅ Seeding des Molts terminé avec succès!');
    console.log(`📊 ${sampleMolts.length} Molts ajoutés/mis à jour`);
    
    // Get final count
    const moltsSnapshot = await db.collection('molts').get();
    console.log(`🎯 Total des Molts en base: ${moltsSnapshot.size}`);
    
    // Show summary
    console.log('\n📋 Résumé des Molts créés:');
    sampleMolts.forEach(molt => {
      const status = molt.paid ? '✅ Premium' : '⭕ Gratuit';
      console.log(`   ${molt.name} (${molt.city}) - ${molt.jobTitle} ${status}`);
      console.log(`     📧 ${molt.email}`);
      console.log(`     💼 ${molt.experiences.length} expérience(s)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des Molts:', error);
    process.exit(1);
  }
}

seedMolts();