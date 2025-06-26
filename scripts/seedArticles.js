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

// Sample articles data matching IArticle interface
const sampleArticles = [
  {
    title: '5 peurs courantes avant une reconversion et comment les dépasser',
    date: new Date('2024-01-15').toISOString(),
    content: `Changer de voie professionnelle est une aventure aussi exaltante qu'angoissante. Avant même de franchir le pas, de nombreuses peurs surgissent et peuvent paralyser nos projets les plus ambitieux.

## 1. La peur de l'échec

Cette peur est naturelle mais ne doit pas vous empêcher d'avancer. Rappelez-vous que l'échec fait partie de l'apprentissage.

## 2. La peur du jugement des autres

Votre entourage peut ne pas comprendre votre choix. Restez focalisé sur vos objectifs et entourez-vous de personnes bienveillantes.

## 3. La peur de l'instabilité financière

Planifiez votre transition en constituant une épargne de sécurité et en vous formant progressivement.

## 4. La peur de ne pas avoir les compétences

Les compétences s'acquièrent ! Identifiez vos besoins de formation et commencez dès aujourd'hui.

## 5. La peur de l'âge

Il n'y a pas d'âge pour se reconvertir. Votre expérience est un atout précieux.`,
    auteur: 'Sophie Martin',
    imageUrl: '/image.png',
    meta: {
      title: '5 peurs courantes avant une reconversion et comment les dépasser',
      description: "Changer de voie professionnelle est une aventure aussi exaltante qu'angoissante. Avant même de franchir le pas, de nombreuses peurs surgissent...",
      keywords: ['reconversion', 'peurs', 'changement', 'carrière', 'développement personnel']
    },
    adminId: 'admin1'
  },
  {
    title: 'Oser se lancer : témoignages de commerçants',
    date: new Date('2024-01-20').toISOString(),
    content: `Ils ont franchi le cap et ouvert leur commerce de proximité. Découvrez leurs parcours inspirants et leurs conseils pour réussir.

## Marie, boulangère à Lyon

"J'ai quitté mon poste de comptable à 35 ans pour reprendre une boulangerie. Le plus dur était de convaincre ma banque, mais aujourd'hui je ne regrette rien !"

## Pierre, libraire à Bordeaux

"Passionné de littérature, j'ai transformé ma passion en métier. Ma librairie spécialisée en BD cartonne auprès des jeunes du quartier."

## Camille, fleuriste à Nantes

"Après 10 ans dans l'informatique, j'avais besoin de travailler avec mes mains. Mon petit atelier floral me rend heureuse chaque jour."`,
    auteur: 'Paul Dubois',
    imageUrl: '/image.png',
    meta: {
      title: 'Oser se lancer : témoignages de commerçants',
      description: 'Découvrez les parcours inspirants de ceux qui ont franchi le cap et ouvert leur commerce de proximité.',
      keywords: ['témoignages', 'commerçants', 'entrepreneuriat', 'commerce de proximité', 'reconversion']
    },
    adminId: 'admin1'
  },
  {
    title: 'Comment bien choisir son local commercial ?',
    date: new Date('2024-01-25').toISOString(),
    content: `Le choix de votre local commercial est crucial pour le succès de votre entreprise. Voici les critères essentiels à prendre en compte.

## L'emplacement : critère n°1

- Visibilité depuis la rue principale
- Accessibilité en transports en commun
- Proximité avec votre clientèle cible
- Facilité de stationnement

## La configuration du local

- Surface adaptée à votre activité
- Possibilité d'aménagement selon vos besoins
- Conformité aux normes d'accessibilité
- État général du bâtiment

## Les aspects financiers

- Loyer en adéquation avec votre budget
- Charges et taxes locales
- Travaux de mise aux normes nécessaires
- Clause de résiliation du bail

## L'environnement commercial

- Présence de commerces complémentaires
- Dynamisme du quartier
- Projets d'aménagement urbain futurs`,
    auteur: 'Marie Leroy',
    imageUrl: '/image.png',
    meta: {
      title: 'Comment bien choisir son local commercial ?',
      description: 'Les critères essentiels pour sélectionner le bon emplacement et réussir son installation.',
      keywords: ['local commercial', 'emplacement', 'business', 'immobilier', 'entrepreneuriat']
    },
    adminId: 'admin1'
  },
  {
    title: 'Trouver ses premiers clients : conseils pratiques',
    date: new Date('2024-01-30').toISOString(),
    content: `Attirer et fidéliser une clientèle locale dès l'ouverture : nos astuces concrètes pour démarrer sur de bonnes bases.

## Avant l'ouverture

- Créez du buzz sur les réseaux sociaux
- Distribuez des flyers dans le quartier
- Organisez une journée portes ouvertes
- Nouez des partenariats avec d'autres commerçants

## Les premiers jours

- Proposez une offre de lancement attractive
- Soignez particulièrement l'accueil
- Demandez les coordonnées pour créer votre base client
- Collectez les premiers avis

## Fidélisation à long terme

- Mettez en place un programme de fidélité
- Organisez des événements réguliers
- Restez actif sur les réseaux sociaux
- Écoutez les retours de vos clients

## Le bouche-à-oreille, votre meilleur allié

Un client satisfait en amène trois autres. Misez tout sur la qualité de service !`,
    auteur: 'Thomas Moreau',
    imageUrl: '/image.png',
    meta: {
      title: 'Trouver ses premiers clients : conseils pratiques',
      description: "Des astuces concrètes pour attirer et fidéliser une clientèle locale dès l'ouverture.",
      keywords: ['clients', 'marketing', 'fidélisation', 'commerce', 'ouverture', 'communication']
    },
    adminId: 'admin1'
  },
  {
    title: 'Les aides financières pour créer son commerce',
    date: new Date('2024-02-05').toISOString(),
    content: `Tour d'horizon des dispositifs d'aide disponibles pour financer votre projet de création d'entreprise.

## Les aides de l'État

- ACRE (Aide aux Créateurs et Repreneurs d'Entreprise)
- NACRE (Nouvel Accompagnement pour la Création ou la Reprise d'Entreprise)
- Prêt d'honneur à taux zéro

## Les aides régionales

- Subventions spécifiques selon votre région
- Prêts à taux préférentiels
- Accompagnement personnalisé

## Les financements privés

- Business angels et investisseurs
- Plateformes de crowdfunding
- Prêts bancaires classiques

## Nos conseils

- Préparez un dossier solide
- Multipliez les sources de financement
- Faites-vous accompagner par des experts`,
    auteur: 'Julien Rousseau',
    imageUrl: '/image.png',
    meta: {
      title: 'Les aides financières pour créer son commerce',
      description: 'Découvrez tous les dispositifs d\'aide disponibles pour financer votre projet d\'entreprise.',
      keywords: ['financement', 'aides', 'création entreprise', 'subventions', 'prêts']
    },
    adminId: 'admin1'
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
    for (let i = 0; i < sampleArticles.length; i++) {
      const article = sampleArticles[i];
      const docId = `article_${Date.now()}_${i}`;
      await db.collection('articles').doc(docId).set(article);
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
