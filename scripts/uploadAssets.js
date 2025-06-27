import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

// Assets configuration with nomenclature mapping
const ASSETS_CONFIG = {
  profiles: {
    folder: 'avatars',
    files: [
      { local: 'homme1.jpg', storage: 'mentor-boulanger.jpg', description: 'Boulanger artisanal' },
      { local: 'femme1.jpg', storage: 'mentor-epiciere.jpg', description: 'Épicière fine' },
      { local: 'femme2.jpg', storage: 'mentor-fleuriste.jpg', description: 'Fleuriste créatrice' },
      { local: 'homme2.jpg', storage: 'mentor-boucher.jpg', description: 'Boucher traditionnel' },
      { local: 'femme3.jpg', storage: 'mentor-libraire.jpg', description: 'Libraire spécialisée' },
      { local: 'homme3.jpg', storage: 'mentor-restaurateur.jpg', description: 'Restaurateur local' },
      { local: 'femme4.jpg', storage: 'mentor-coach.jpg', description: 'Coach reconversion' },
      { local: 'homme4.jpg', storage: 'molt-dev1.jpg', description: 'Développeur 1' },
      { local: 'homme5.jpg', storage: 'molt-dev2.jpg', description: 'Développeur 2' },
      { local: 'femme5.jpg', storage: 'molt-designer.jpg', description: 'Designer UX/UI' },
      { local: 'femme6.jpg', storage: 'molt-pm.jpg', description: 'Chef de projet' },
    ]
  },
  annonces: {
    folder: 'images/annonces',
    files: [
      { local: 'boulangerie1.jpg', storage: 'annonce-boulangerie.jpg', description: 'Boulangerie artisanale' },
      { local: 'epicerie1.jpg', storage: 'annonce-epicerie.jpg', description: 'Épicerie fine' },
      { local: 'fleuriste1.webp', storage: 'annonce-fleuriste.webp', description: 'Atelier floral' },
      { local: 'boucherie1.jpg', storage: 'annonce-boucherie.jpg', description: 'Boucherie traditionnelle' },
      { local: 'librairie1.jpg', storage: 'annonce-librairie.jpg', description: 'Librairie spécialisée' },
      { local: 'restauration1.jpg', storage: 'annonce-restaurant.jpg', description: 'Restaurant local' },
      { local: 'boulangerie2.webp', storage: 'annonce-formation.webp', description: 'Centre de formation' }
    ]
  }
};

async function uploadFile(bucket, localPath, storagePath, description) {
  try {
    if (!fs.existsSync(localPath)) {
      throw new Error(`Fichier local introuvable: ${localPath}`);
    }

    const file = bucket.file(storagePath);
    
    // Upload the file
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        metadata: {
          description: description,
          uploadedBy: 'molty-seeding-script',
          uploadDate: new Date().toISOString()
        }
      }
    });

    // Make the file publicly readable
    await file.makePublic();
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
    
    return { success: true, url: publicUrl };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function uploadAssets() {
  console.log('🚀 DÉBUT DE L\'UPLOAD DES ASSETS VERS FIREBASE STORAGE');
  console.log('📁 Upload des images pour profils et annonces\n');
  
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    const app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET
    });

    const storage = getStorage(app);
    const bucket = storage.bucket();
    
    console.log(`📡 Connecté au bucket: ${bucket.name}\n`);
    
    const results = {
      profiles: { uploaded: [], errors: [] },
      annonces: { uploaded: [], errors: [] },
      totalUploaded: 0,
      totalErrors: 0
    };

    // Upload profile images
    console.log('👤 Upload des images de profil...');
    const assetsPath = path.join(__dirname, 'assets');
    
    for (const asset of ASSETS_CONFIG.profiles.files) {
      const localPath = path.join(assetsPath, asset.local);
      const storagePath = `${ASSETS_CONFIG.profiles.folder}/${asset.storage}`;
      
      console.log(`   📤 Upload: ${asset.local} → ${storagePath}`);
      
      const result = await uploadFile(bucket, localPath, storagePath, asset.description);
      
      if (result.success) {
        console.log(`   ✅ Succès: ${result.url}`);
        results.profiles.uploaded.push({
          local: asset.local,
          storage: asset.storage,
          url: result.url,
          description: asset.description
        });
        results.totalUploaded++;
      } else {
        console.error(`   ❌ Erreur: ${result.error}`);
        results.profiles.errors.push({
          local: asset.local,
          error: result.error
        });
        results.totalErrors++;
      }
    }

    console.log('\n🏪 Upload des images d\'annonces...');
    
    for (const asset of ASSETS_CONFIG.annonces.files) {
      const localPath = path.join(assetsPath, asset.local);
      const storagePath = `${ASSETS_CONFIG.annonces.folder}/${asset.storage}`;
      
      console.log(`   📤 Upload: ${asset.local} → ${storagePath}`);
      
      const result = await uploadFile(bucket, localPath, storagePath, asset.description);
      
      if (result.success) {
        console.log(`   ✅ Succès: ${result.url}`);
        results.annonces.uploaded.push({
          local: asset.local,
          storage: asset.storage,
          url: result.url,
          description: asset.description
        });
        results.totalUploaded++;
      } else {
        console.error(`   ❌ Erreur: ${result.error}`);
        results.annonces.errors.push({
          local: asset.local,
          error: result.error
        });
        results.totalErrors++;
      }
    }

    // Generate asset mapping file for seeding scripts
    const assetMapping = {
      profiles: {},
      annonces: {}
    };

    results.profiles.uploaded.forEach(asset => {
      const key = asset.storage.replace('.jpg', '').replace('.webp', '');
      assetMapping.profiles[key] = asset.url;
    });

    results.annonces.uploaded.forEach(asset => {
      const key = asset.storage.replace('.jpg', '').replace('.webp', '');
      assetMapping.annonces[key] = asset.url;
    });

    // Save asset mapping to JSON file for use in seeding
    const mappingPath = path.join(__dirname, 'assetMapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(assetMapping, null, 2));
    
    // Display final report
    console.log('\n📊 RAPPORT FINAL D\'UPLOAD');
    console.log('============================\n');
    
    console.log(`🎯 Total fichiers uploadés: ${results.totalUploaded}`);
    console.log(`❌ Total erreurs: ${results.totalErrors}`);
    
    console.log('\n👤 PROFILS UPLOADÉS:');
    results.profiles.uploaded.forEach(asset => {
      console.log(`   ✅ ${asset.description}: ${asset.storage}`);
    });
    
    console.log('\n🏪 ANNONCES UPLOADÉES:');
    results.annonces.uploaded.forEach(asset => {
      console.log(`   ✅ ${asset.description}: ${asset.storage}`);
    });
    
    if (results.totalErrors > 0) {
      console.log('\n❌ ERREURS:');
      [...results.profiles.errors, ...results.annonces.errors].forEach(error => {
        console.log(`   ❌ ${error.local}: ${error.error}`);
      });
    }
    
    console.log(`\n📄 Mapping des assets sauvegardé: ${mappingPath}`);
    console.log('🚀 Assets prêts pour le seeding!\n');
    
    process.exit(results.totalErrors > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('💥 ERREUR CRITIQUE lors de l\'upload:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

uploadAssets();