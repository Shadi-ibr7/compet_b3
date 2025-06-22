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

async function migrateNumberToEmail() {
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    initializeApp({
      credential: cert(serviceAccount)
    });

    const db = getFirestore();
    
    console.log('🔄 Début de la migration number → email...');

    // Collections à migrer
    const collections = ['molts', 'mentors'];
    let totalMigrated = 0;

    for (const collectionName of collections) {
      console.log(`\n📂 Migration de la collection: ${collectionName}`);
      
      const snapshot = await db.collection(collectionName).get();
      
      if (snapshot.empty) {
        console.log(`   ⚠️ Collection ${collectionName} vide, passage à la suivante`);
        continue;
      }

      let collectionMigrated = 0;
      const batch = db.batch();

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        
        // Vérifier si le document a un champ 'number' 
        if (data.number) {
          console.log(`   🔄 Migration: ${data.name || doc.id} (${data.number} → email)`);
          
          // Ajouter le champ email avec la valeur de number
          batch.update(doc.ref, { email: data.number });
          collectionMigrated++;
        } else if (data.email) {
          console.log(`   ✅ Déjà migré: ${data.name || doc.id} (${data.email})`);
        } else {
          console.log(`   ⚠️ Document sans email ni number: ${doc.id}`);
        }
      });

      if (collectionMigrated > 0) {
        await batch.commit();
        console.log(`   ✅ ${collectionMigrated} documents migrés dans ${collectionName}`);
        
        // Note: On garde le champ 'number' pour l'instant pour éviter de casser l'app
        // Il sera supprimé une fois que tous les composants sont mis à jour
        console.log(`   📝 Note: Le champ 'number' est conservé temporairement`);
        console.log(`   📝 Il sera supprimé après mise à jour complète des composants`);
      }
      
      totalMigrated += collectionMigrated;
    }

    console.log(`\n✅ Migration terminée avec succès!`);
    console.log(`📊 Total des documents migrés: ${totalMigrated}`);
    
    // Vérification finale
    console.log('\n🔍 Vérification post-migration:');
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const withEmail = snapshot.docs.filter(doc => doc.data().email).length;
      const withNumber = snapshot.docs.filter(doc => doc.data().number).length;
      
      console.log(`   ${collectionName}: ${withEmail} avec email, ${withNumber} avec number restants`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

migrateNumberToEmail();