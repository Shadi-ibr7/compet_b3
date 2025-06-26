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

// Sample annonces for each mentor
const sampleAnnonces = [
  {
    id: 'annonce-sophie-martin-1',
    nomMetier: 'Assistant(e) Épicier Fine',
    nomEtablissement: 'Épicerie du Terroir - Sophie Martin',
    localisation: 'Lyon, France',
    type: 'CDI',
    description: 'Rejoignez notre équipe passionnée ! Nous recherchons un(e) assistant(e) pour notre épicerie fine spécialisée dans les produits du terroir. Vous accompagnerez les clients dans leurs choix, participerez à la mise en valeur des produits et contribuerez à l\'ambiance chaleureuse de notre boutique.',
    ceQueJePropose: 'Formation complète aux produits du terroir, environnement de travail convivial, horaires flexibles, participation aux dégustations et événements de la boutique. Possibilité d\'évolution vers la gestion de rayon.',
    profilRecherche: 'Personne dynamique avec le goût du contact client, curiosité pour les produits artisanaux, sens de l\'esthétique pour la présentation des produits. Expérience en commerce de proximité appréciée mais pas obligatoire.',
    date: new Date(),
    imageUrl: '/placeholder_article.png',
    adminId: 'mentor-sophie-martin',
    mentorId: 'mentor-sophie-martin'
  },
  {
    id: 'annonce-paul-dubois-1',
    nomMetier: 'Apprenti(e) Boulanger',
    nomEtablissement: 'Boulangerie Artisanale Paul Dubois',
    localisation: 'Bordeaux, France',
    type: 'Apprentissage',
    description: 'Découvrez le métier de boulanger dans notre atelier traditionnel ! Formation complète aux techniques de panification, travail des pâtes, cuisson au four à bois. Vous apprendrez tous les secrets du pain artisanal et des spécialités biologiques.',
    ceQueJePropose: 'Formation de maître boulanger avec 20 ans d\'expérience, apprentissage des techniques traditionnelles et modernes, spécialisation en pains biologiques, environnement familial et bienveillant. Possibilité de formation continue et certification.',
    profilRecherche: 'Motivation et passion pour l\'artisanat boulanger, capacité à se lever tôt, goût du travail manuel et de précision. Aucune expérience requise, nous formons nos apprentis avec patience et expertise.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    imageUrl: '/placeholder_article.png',
    adminId: 'mentor-paul-dubois',
    mentorId: 'mentor-paul-dubois'
  },
  {
    id: 'annonce-marie-leroy-1',
    nomMetier: 'Assistant(e) Fleuriste Créateur',
    nomEtablissement: 'Atelier Floral Marie Leroy',
    localisation: 'Marseille, France',
    type: 'CDD',
    description: 'Intégrez notre atelier créatif spécialisé dans les compositions florales sur-mesure ! Vous participez à la création de bouquets uniques, à l\'accueil client et au développement de notre activité locale. Environnement artistique et stimulant.',
    ceQueJePropose: 'Formation à la création florale, techniques de composition avancées, accompagnement entrepreneurial pour développer vos propres projets, participation aux événements et mariages, environnement créatif et inspirant.',
    profilRecherche: 'Sensibilité artistique et créativité, goût pour les fleurs et la nature, sens relationnel pour l\'accueil client, motivation pour apprendre les techniques florales. Esprit entrepreneurial apprécié.',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    imageUrl: '/placeholder_article.png',
    adminId: 'mentor-marie-leroy',
    mentorId: 'mentor-marie-leroy'
  },
  {
    id: 'annonce-sophie-martin-2',
    nomMetier: 'Responsable Développement Commercial',
    nomEtablissement: 'Épicerie du Terroir - Sophie Martin',
    localisation: 'Lyon, France',
    type: 'CDI',
    description: 'Poste clé pour développer notre réseau de producteurs et notre clientèle ! Vous serez en charge de nouer des partenariats avec les artisans locaux, d\'organiser des événements de dégustation et de développer notre présence sur les marchés.',
    ceQueJePropose: 'Autonomie dans la gestion de projets, formation au sourcing de produits artisanaux, participation aux salons et foires, véhicule de fonction, commission sur les ventes développées.',
    profilRecherche: 'Expérience commerciale souhaitée, connaissance du secteur alimentaire artisanal, permis B obligatoire, goût pour la négociation et le développement de partenariats.',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    imageUrl: '/placeholder_article.png',
    adminId: 'mentor-sophie-martin',
    mentorId: 'mentor-sophie-martin'
  },
  {
    id: 'annonce-paul-dubois-2',
    nomMetier: 'Boulanger Confirmé H/F',
    nomEtablissement: 'Boulangerie Artisanale Paul Dubois',
    localisation: 'Bordeaux, France',
    type: 'CDI',
    description: 'Rejoignez notre équipe en tant que boulanger confirmé ! Vous travaillerez en autonomie sur la production quotidienne, encadrerez les apprentis et participerez au développement de nouvelles recettes. Spécialisation en pains biologiques et traditionnels.',
    ceQueJePropose: 'Salaire attractif selon expérience, prime de nuit, congés payés étendus, formation continue aux nouvelles techniques, participation aux bénéfices, évolution possible vers l\'association.',
    profilRecherche: 'CAP Boulanger minimum, 3 ans d\'expérience en boulangerie artisanale, maîtrise des techniques traditionnelles, capacité d\'encadrement, passion pour la qualité et l\'innovation.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    imageUrl: '/placeholder_article.png',
    adminId: 'mentor-paul-dubois',
    mentorId: 'mentor-paul-dubois'
  }
];

async function seedAnnoncesForMentors() {
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    initializeApp({
      credential: cert(serviceAccount)
    });

    const db = getFirestore();
    
    console.log('🚀 Début du seeding des annonces pour les mentors...');

    // Add each annonce to Firestore
    for (const annonce of sampleAnnonces) {
      const { id, ...annonceData } = annonce;
      
      console.log(`📝 Ajout de l'annonce: ${annonceData.nomMetier} - ${annonceData.nomEtablissement}`);
      
      // Check if annonce already exists
      const existingAnnonce = await db.collection('annonces').doc(id).get();
      
      if (existingAnnonce.exists) {
        console.log(`⚠️  L'annonce ${annonceData.nomMetier} existe déjà, mise à jour...`);
        await db.collection('annonces').doc(id).update(annonceData);
      } else {
        console.log(`✨ Création de la nouvelle annonce: ${annonceData.nomMetier}`);
        await db.collection('annonces').doc(id).set(annonceData);
      }
    }

    console.log('✅ Seeding des annonces terminé avec succès!');
    console.log(`📊 ${sampleAnnonces.length} annonces ajoutées/mises à jour`);
    
    // Get final count
    const annoncesSnapshot = await db.collection('annonces').get();
    console.log(`🎯 Total des annonces en base: ${annoncesSnapshot.size}`);
    
    // Show summary by mentor
    console.log('\n📋 Résumé par mentor:');
    const mentorGroups = sampleAnnonces.reduce((acc, annonce) => {
      if (!acc[annonce.mentorId]) acc[annonce.mentorId] = [];
      acc[annonce.mentorId].push(annonce.nomMetier);
      return acc;
    }, {});
    
    for (const [mentorId, annonces] of Object.entries(mentorGroups)) {
      console.log(`   ${mentorId}: ${annonces.length} annonce(s)`);
      annonces.forEach(titre => console.log(`     - ${titre}`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding des annonces:', error);
    process.exit(1);
  }
}

seedAnnoncesForMentors();