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

// Sample articles data
const sampleArticles = [
  {
    id: 'article1',
    title: 'Introduction à la Lean Startup',
    content: 'La méthodologie Lean Startup est une approche qui permet de créer et gérer des startups...',
    author: 'Eric Ries',
    publishedAt: new Date().toISOString(),
    tags: ['lean', 'startup', 'methodology']
  },
  {
    id: 'article2',
    title: 'Le MVP (Minimum Viable Product)',
    content: 'Un MVP est la version d\'un nouveau produit qui permet à une équipe de collecter...',
    author: 'Steve Blank',
    publishedAt: new Date().toISOString(),
    tags: ['mvp', 'product', 'development']
  }
];

async function seedArticles() {
  try {
    // Initialize Firebase Admin
    initializeApp({
      credential: cert(serviceAccount)
    });
    const db = getFirestore();
    
    console.log('Connected to Firestore project:', process.env.PROJECT_ID);

    // Seed each article
    for (const article of sampleArticles) {
      await db.collection('articles').doc(article.id).set(article);
      console.log(`✅ Article seeded: ${article.title}`);
    }

    console.log('🌱 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding articles:', error);
    process.exit(1);
  }
}

// Run the seeding
seedArticles();
