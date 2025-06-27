import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
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

// Collections to clean
const COLLECTIONS_TO_CLEAN = [
  'users',
  'mentors', 
  'molts',
  'admins',
  'articles',
  'annonces',
  'applications',
  'ratings',
  'sessions',
  'accounts',
  'verification_tokens'
];

// Storage folders to clean
const STORAGE_FOLDERS = [
  'avatars',
  'documents', 
  'images',
  'annonces',
  'profiles'
];

async function cleanFirestoreCollections(db) {
  console.log('🔥 Début du nettoyage des collections Firestore...\n');
  
  const results = {
    cleaned: [],
    errors: [],
    totalDeleted: 0
  };

  for (const collectionName of COLLECTIONS_TO_CLEAN) {
    try {
      console.log(`📋 Nettoyage de la collection: ${collectionName}`);
      
      const collectionRef = db.collection(collectionName);
      const snapshot = await collectionRef.get();
      
      if (snapshot.empty) {
        console.log(`   ⚠️  Collection '${collectionName}' déjà vide`);
        results.cleaned.push({ collection: collectionName, count: 0 });
        continue;
      }

      const batchSize = 500; // Firestore batch limit
      let deletedCount = 0;
      
      while (true) {
        const batch = db.batch();
        const docs = await collectionRef.limit(batchSize).get();
        
        if (docs.empty) break;
        
        docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        deletedCount += docs.size;
        console.log(`   🗑️  Supprimé ${docs.size} documents (total: ${deletedCount})`);
        
        if (docs.size < batchSize) break;
      }
      
      results.cleaned.push({ collection: collectionName, count: deletedCount });
      results.totalDeleted += deletedCount;
      console.log(`   ✅ Collection '${collectionName}' nettoyée: ${deletedCount} documents supprimés\n`);
      
    } catch (error) {
      console.error(`   ❌ Erreur lors du nettoyage de '${collectionName}':`, error.message);
      results.errors.push({ collection: collectionName, error: error.message });
    }
  }
  
  return results;
}

async function cleanFirebaseStorage(storage) {
  console.log('📦 Début du nettoyage du Firebase Storage...\n');
  
  const results = {
    cleaned: [],
    errors: [],
    totalDeleted: 0
  };

  const bucket = storage.bucket();
  
  for (const folder of STORAGE_FOLDERS) {
    try {
      console.log(`📁 Nettoyage du dossier: ${folder}/`);
      
      const [files] = await bucket.getFiles({ prefix: `${folder}/` });
      
      if (files.length === 0) {
        console.log(`   ⚠️  Dossier '${folder}/' déjà vide`);
        results.cleaned.push({ folder, count: 0 });
        continue;
      }
      
      // Delete files in batches
      const batchSize = 100;
      let deletedCount = 0;
      
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (file) => {
            try {
              await file.delete();
              console.log(`   🗑️  Supprimé: ${file.name}`);
              deletedCount++;
            } catch (error) {
              console.error(`   ❌ Erreur suppression ${file.name}:`, error.message);
            }
          })
        );
      }
      
      results.cleaned.push({ folder, count: deletedCount });
      results.totalDeleted += deletedCount;
      console.log(`   ✅ Dossier '${folder}/' nettoyé: ${deletedCount} fichiers supprimés\n`);
      
    } catch (error) {
      console.error(`   ❌ Erreur lors du nettoyage du dossier '${folder}':`, error.message);
      results.errors.push({ folder, error: error.message });
    }
  }
  
  return results;
}

async function cleanDatabase() {
  console.log('🚀 DÉBUT DU NETTOYAGE COMPLET DE LA BASE DE DONNÉES MOLTY');
  console.log('⚠️  ATTENTION: Cette opération va supprimer TOUTES les données!\n');
  
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    const app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET
    });

    const db = getFirestore(app);
    const storage = getStorage(app);
    
    console.log(`📡 Connecté au projet Firebase: ${process.env.PROJECT_ID}\n`);
    
    // Clean Firestore collections
    const firestoreResults = await cleanFirestoreCollections(db);
    
    // Clean Firebase Storage
    const storageResults = await cleanFirebaseStorage(storage);
    
    // Display final report
    console.log('📊 RAPPORT FINAL DE NETTOYAGE');
    console.log('================================\n');
    
    console.log('🔥 FIRESTORE:');
    console.log(`   Total documents supprimés: ${firestoreResults.totalDeleted}`);
    firestoreResults.cleaned.forEach(({ collection, count }) => {
      console.log(`   - ${collection}: ${count} documents`);
    });
    
    if (firestoreResults.errors.length > 0) {
      console.log('\n❌ Erreurs Firestore:');
      firestoreResults.errors.forEach(({ collection, error }) => {
        console.log(`   - ${collection}: ${error}`);
      });
    }
    
    console.log('\n📦 STORAGE:');
    console.log(`   Total fichiers supprimés: ${storageResults.totalDeleted}`);
    storageResults.cleaned.forEach(({ folder, count }) => {
      console.log(`   - ${folder}/: ${count} fichiers`);
    });
    
    if (storageResults.errors.length > 0) {
      console.log('\n❌ Erreurs Storage:');
      storageResults.errors.forEach(({ folder, error }) => {
        console.log(`   - ${folder}: ${error}`);
      });
    }
    
    const totalErrors = firestoreResults.errors.length + storageResults.errors.length;
    const totalSuccess = firestoreResults.totalDeleted + storageResults.totalDeleted;
    
    if (totalErrors === 0) {
      console.log('\n✅ NETTOYAGE TERMINÉ AVEC SUCCÈS!');
      console.log(`🎯 ${totalSuccess} éléments supprimés au total`);
      console.log('🚀 La base de données est maintenant vide et prête pour le re-seeding\n');
    } else {
      console.log(`\n⚠️  NETTOYAGE TERMINÉ AVEC ${totalErrors} ERREUR(S)`);
      console.log(`🎯 ${totalSuccess} éléments supprimés malgré les erreurs\n`);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('💥 ERREUR CRITIQUE lors du nettoyage:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Confirmation prompt simulation (in production, you'd use readline)
console.log('⚠️  ATTENTION: Ce script va supprimer TOUTES les données de la base!');
console.log('📊 Collections à supprimer:', COLLECTIONS_TO_CLEAN.join(', '));
console.log('📦 Dossiers Storage à vider:', STORAGE_FOLDERS.join(', '));
console.log('\n🚀 Lancement du nettoyage dans 3 secondes...\n');

setTimeout(cleanDatabase, 3000);