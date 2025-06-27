import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
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

// Load asset mapping (created by uploadAssets.js)
let assetMapping = {};
const mappingPath = path.join(__dirname, 'assetMapping.json');
if (fs.existsSync(mappingPath)) {
  assetMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
}

// Helper function to get asset URL
function getAssetUrl(category, key) {
  return assetMapping[category]?.[key] || `/placeholder_${category}.png`;
}

// Generate realistic data
const ADMIN_USER = {
  id: 'admin-molty-platform',
  name: 'Admin Molty',
  email: 'admin@molty.fr',
  role: 'admin',
  image: getAssetUrl('profiles', 'admin'),
  city: 'Paris, France',
  jobTitle: 'Administrateur Plateforme',
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  emailVerified: Timestamp.now()
};

const MENTORS_DATA = [
  {
    id: 'mentor-antoine-boulanger',
    name: 'Antoine Moreau',
    email: 'antoine.moreau@boulangerie-artisanale.fr',
    role: 'mentor',
    image: getAssetUrl('profiles', 'mentor-boulanger'),
    city: 'Lyon, France',
    jobTitle: 'Boulanger Artisanal',
    company: 'Boulangerie du Terroir',
    location: 'Lyon 7ème, France',
    description: 'Maître boulanger depuis 15 ans, spécialisé dans les pains biologiques et les techniques traditionnelles françaises. Je forme les futurs artisans boulangers et accompagne les projets de création de boulangeries artisanales. Mon expertise couvre la panification traditionnelle, la gestion d\'une boulangerie et le développement commercial local.',
    expertise: ['Panification traditionnelle', 'Pains biologiques', 'Gestion boulangerie', 'Formation professionnelle'],
    experience: '15 ans d\'expérience',
    rating: 4.8,
    verified: true,
    linkedinUrl: 'https://linkedin.com/in/antoine-moreau-boulanger',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'mentor-sophie-epiciere',
    name: 'Sophie Martin',
    email: 'sophie.martin@epicerie-terroir.fr',
    role: 'mentor',
    image: getAssetUrl('profiles', 'mentor-epiciere'),
    city: 'Bordeaux, France',
    jobTitle: 'Épicière Fine & Conseil Produits',
    company: 'L\'Épicerie du Terroir',
    location: 'Bordeaux Centre, France',
    description: 'Passionnée par les produits du terroir français, je vous accompagne dans la création et le développement de votre épicerie fine. Mon expertise en sélection de producteurs locaux, merchandising et conseil client me permet de vous transmettre les clés du succès dans ce secteur exigeant mais passionnant.',
    expertise: ['Produits du terroir', 'Sélection producteurs', 'Merchandising', 'Conseil clientèle'],
    experience: '12 ans d\'expérience',
    rating: 4.9,
    verified: true,
    linkedinUrl: 'https://linkedin.com/in/sophie-martin-epicerie',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'mentor-marie-fleuriste',
    name: 'Marie Dubois',
    email: 'marie.dubois@atelier-floral.fr',
    role: 'mentor',
    image: getAssetUrl('profiles', 'mentor-fleuriste'),
    city: 'Marseille, France',
    jobTitle: 'Fleuriste Créatrice',
    company: 'Atelier Floral Créatif',
    location: 'Marseille 6ème, France',
    description: 'Artiste florale et entrepreneure, je crée des compositions uniques depuis 10 ans. Mon atelier propose formations et accompagnement pour les passionnés de fleurs souhaitant se lancer dans l\'art floral professionnel. Je vous aide à développer votre créativité et votre expertise technique.',
    expertise: ['Art floral', 'Compositions créatives', 'Formation technique', 'Entrepreneuriat créatif'],
    experience: '10 ans d\'expérience',
    rating: 4.7,
    verified: true,
    linkedinUrl: 'https://linkedin.com/in/marie-dubois-fleuriste',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'mentor-paul-boucher',
    name: 'Paul Rousseau',
    email: 'paul.rousseau@boucherie-traditionnelle.fr',
    role: 'mentor',
    image: getAssetUrl('profiles', 'mentor-boucher'),
    city: 'Toulouse, France',
    jobTitle: 'Boucher Traditionnel',
    company: 'Boucherie Rousseau & Fils',
    location: 'Toulouse Centre, France',
    description: 'Boucher de 3ème génération, je perpétue les traditions familiales tout en m\'adaptant aux nouvelles attentes des consommateurs. Expert en découpe traditionnelle, sélection de viandes de qualité et relation client, je forme les futurs professionnels de la boucherie artisanale.',
    expertise: ['Découpe traditionnelle', 'Sélection viandes', 'Boucherie artisanale', 'Transmission savoir-faire'],
    experience: '18 ans d\'expérience',
    rating: 4.8,
    verified: true,
    linkedinUrl: 'https://linkedin.com/in/paul-rousseau-boucher',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'mentor-clara-libraire',
    name: 'Clara Leroy',
    email: 'clara.leroy@librairie-independante.fr',
    role: 'mentor',
    image: getAssetUrl('profiles', 'mentor-libraire'),
    city: 'Nantes, France',
    jobTitle: 'Libraire Spécialisée',
    company: 'Librairie L\'Encre & La Plume',
    location: 'Nantes Centre, France',
    description: 'Libraire indépendante passionnée, spécialisée en littérature contemporaine et jeunesse. J\'accompagne les projets de création de librairies et partage mon expertise en sélection d\'ouvrages, animation culturelle et développement d\'une communauté de lecteurs fidèles.',
    expertise: ['Littérature spécialisée', 'Animation culturelle', 'Gestion librairie', 'Communauté lecteurs'],
    experience: '8 ans d\'expérience',
    rating: 4.6,
    verified: true,
    linkedinUrl: 'https://linkedin.com/in/clara-leroy-libraire',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'mentor-julien-restaurateur',
    name: 'Julien Bernard',
    email: 'julien.bernard@bistrot-local.fr',
    role: 'mentor',
    image: getAssetUrl('profiles', 'mentor-restaurateur'),
    city: 'Lille, France',
    jobTitle: 'Restaurateur',
    company: 'Le Bistrot du Quartier',
    location: 'Lille Vieux-Lille, France',
    description: 'Chef et gérant de restaurant depuis 12 ans, je propose une cuisine de bistrot moderne avec des produits locaux. Mon expérience couvre la création de concept, la gestion d\'équipe, l\'optimisation des coûts et le développement de la clientèle locale. Je forme aux métiers de la restauration.',
    expertise: ['Cuisine bistrot', 'Gestion restaurant', 'Produits locaux', 'Management équipe'],
    experience: '12 ans d\'expérience',
    rating: 4.5,
    verified: true,
    linkedinUrl: 'https://linkedin.com/in/julien-bernard-chef',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'mentor-isabelle-coach',
    name: 'Isabelle Moreau',
    email: 'isabelle.moreau@coaching-reconversion.fr',
    role: 'mentor',
    image: getAssetUrl('profiles', 'mentor-coach'),
    city: 'Strasbourg, France',
    jobTitle: 'Coach en Reconversion',
    company: 'Nouveau Départ Coaching',
    location: 'Strasbourg, France',
    description: 'Coach certifiée spécialisée dans l\'accompagnement des reconversions professionnelles vers les métiers du commerce et de l\'artisanat. J\'aide les personnes à identifier leurs talents, définir leur projet et franchir le pas vers une nouvelle carrière épanouissante dans les secteurs traditionnels.',
    expertise: ['Coaching reconversion', 'Bilan de compétences', 'Orientation professionnelle', 'Développement personnel'],
    experience: '7 ans d\'expérience',
    rating: 4.9,
    verified: true,
    linkedinUrl: 'https://linkedin.com/in/isabelle-moreau-coach',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  }
];

const MOLTS_DATA = [
  {
    id: 'molt-nathaniel-dev',
    name: 'Nathaniel Moreau',
    email: 'nathaniel.moreau@email.fr',
    role: 'molt',
    image: getAssetUrl('profiles', 'molt-dev1'),
    city: 'Paris, France',
    jobTitle: 'Développeur Full-Stack',
    motivation: 'Passionné par le développement web depuis 5 ans, je souhaite mettre mes compétences techniques au service de projets innovants dans le commerce local. Mon expérience en React et Node.js me permet de créer des solutions digitales modernes pour les commerçants.',
    linkedinUrl: 'https://linkedin.com/in/nathaniel-moreau-dev',
    paid: true,
    experiences: [
      {
        type: 'pro',
        institution: 'TechCorp Paris',
        position: 'Développeur Frontend React',
        startDate: '2022-01-15',
        endDate: '2023-12-31'
      },
      {
        type: 'pro',
        institution: 'Digital Solutions',
        position: 'Développeur Full-Stack',
        startDate: '2024-01-01'
      }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'molt-clara-designer',
    name: 'Clara Martin',
    email: 'clara.martin@email.fr',
    role: 'molt',
    image: getAssetUrl('profiles', 'molt-designer'),
    city: 'Lyon, France',
    jobTitle: 'Designer UX/UI',
    motivation: 'Designer créative avec 4 ans d\'expérience, je cherche à allier créativité et impact social en aidant les commerces locaux à développer leur présence digitale. Mon approche centrée utilisateur permet de créer des expériences engageantes.',
    linkedinUrl: 'https://linkedin.com/in/clara-martin-ux',
    paid: true,
    experiences: [
      {
        type: 'pro',
        institution: 'Studio Créatif Lyon',
        position: 'UX Designer',
        startDate: '2021-03-01',
        endDate: '2023-08-31'
      },
      {
        type: 'pro',
        institution: 'Freelance Design',
        position: 'UI/UX Designer',
        startDate: '2023-09-01'
      }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'molt-julien-pm',
    name: 'Julien Dubois',
    email: 'julien.dubois@email.fr',
    role: 'molt',
    image: getAssetUrl('profiles', 'molt-pm'),
    city: 'Bordeaux, France',
    jobTitle: 'Chef de Projet Digital',
    motivation: 'Chef de projet expérimenté, je souhaite mettre mes compétences en gestion et coordination au service de projets concrets dans le commerce traditionnel. Ma capacité à fédérer les équipes et respecter les délais sera un atout pour vos projets.',
    linkedinUrl: 'https://linkedin.com/in/julien-dubois-pm',
    paid: true,
    experiences: [
      {
        type: 'pro',
        institution: 'Agence Digital Bordeaux',
        position: 'Chef de Projet Web',
        startDate: '2020-06-01',
        endDate: '2023-05-31'
      },
      {
        type: 'pro',
        institution: 'StartupBDX',
        position: 'Product Owner',
        startDate: '2023-06-01'
      }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'molt-sophie-mobile',
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.fr',
    role: 'molt',
    image: getAssetUrl('profiles', 'molt-dev2'),
    city: 'Marseille, France',
    jobTitle: 'Développeuse Mobile',
    motivation: 'Spécialisée dans le développement mobile natif et hybride depuis 3 ans, je cherche de nouvelles opportunités pour créer des applications impactantes pour le commerce local. Mon expertise en Flutter et React Native permet de développer des solutions cross-platform efficaces.',
    linkedinUrl: 'https://linkedin.com/in/sophie-bernard-mobile',
    paid: false,
    experiences: [
      {
        type: 'pro',
        institution: 'MobileTech Marseille',
        position: 'Développeuse Flutter',
        startDate: '2022-09-01',
        endDate: '2024-03-31'
      },
      {
        type: 'pro',
        institution: 'Freelance Mobile',
        position: 'Développeuse React Native',
        startDate: '2024-04-01'
      }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'molt-thomas-marketing',
    name: 'Thomas Lefevre',
    email: 'thomas.lefevre@email.fr',
    role: 'molt',
    image: getAssetUrl('profiles', 'molt-dev1'),
    city: 'Nantes, France',
    jobTitle: 'Chargé de Marketing Digital',
    motivation: 'Spécialiste du marketing digital avec une passion pour le commerce local, je souhaite aider les artisans et commerçants à développer leur visibilité en ligne. Mon expertise en SEO, réseaux sociaux et e-commerce sera un atout pour votre développement.',
    linkedinUrl: 'https://linkedin.com/in/thomas-lefevre-marketing',
    paid: true,
    experiences: [
      {
        type: 'pro',
        institution: 'Agence Marketing Nantes',
        position: 'Traffic Manager',
        startDate: '2021-05-01',
        endDate: '2023-10-31'
      },
      {
        type: 'pro',
        institution: 'Commerce Connect',
        position: 'Consultant Marketing Digital',
        startDate: '2023-11-01'
      }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'molt-alice-gestion',
    name: 'Alice Rousseau',
    email: 'alice.rousseau@email.fr',
    role: 'molt',
    image: getAssetUrl('profiles', 'molt-designer'),
    city: 'Toulouse, France',
    jobTitle: 'Assistante de Gestion',
    motivation: 'Organisée et rigoureuse, j\'ai 6 ans d\'expérience en gestion administrative et comptable. Je cherche à rejoindre une structure où mes compétences en organisation, suivi client et gestion administrative apporteront une vraie valeur ajoutée au quotidien.',
    linkedinUrl: 'https://linkedin.com/in/alice-rousseau-gestion',
    paid: false,
    experiences: [
      {
        type: 'pro',
        institution: 'Cabinet Comptable Toulouse',
        position: 'Assistante Administrative',
        startDate: '2019-09-01',
        endDate: '2023-07-31'
      },
      {
        type: 'pro',
        institution: 'PME Services',
        position: 'Gestionnaire Administrative',
        startDate: '2023-08-01'
      }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  },
  {
    id: 'molt-maxime-commerce',
    name: 'Maxime Garnier',
    email: 'maxime.garnier@email.fr',
    role: 'molt',
    image: getAssetUrl('profiles', 'molt-pm'),
    city: 'Lille, France',
    jobTitle: 'Vendeur Spécialisé',
    motivation: 'Commercial passionné avec 5 ans d\'expérience dans la vente spécialisée, je souhaite mettre mes compétences relationnelles et ma connaissance produit au service d\'un commerce traditionnel. Mon approche conseil et ma capacité d\'écoute fidélisent la clientèle.',
    linkedinUrl: 'https://linkedin.com/in/maxime-garnier-vente',
    paid: true,
    experiences: [
      {
        type: 'pro',
        institution: 'Magasin Spécialisé Lille',
        position: 'Vendeur Conseil',
        startDate: '2020-03-01',
        endDate: '2024-01-31'
      },
      {
        type: 'pro',
        institution: 'Commerce Expert',
        position: 'Responsable Secteur',
        startDate: '2024-02-01'
      }
    ],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    emailVerified: Timestamp.now()
  }
];

// Annonces data (max 1 per mentor)
const ANNONCES_DATA = [
  {
    id: 'annonce-apprenti-boulanger',
    title: 'Apprenti Boulanger - Formation en Alternance',
    description: 'Rejoignez notre boulangerie artisanale pour apprendre les techniques traditionnelles de panification. Formation complète sur 2 ans avec un maître boulanger expérimenté. Vous découvrirez la fabrication de pains spéciaux, viennoiseries et pâtisseries dans un environnement familial et passionné.',
    company: 'Boulangerie du Terroir',
    location: 'Lyon 7ème, France',
    type: 'alternance',
    requirements: 'Motivation et passion pour l\'artisanat boulanger. Aucune expérience requise, formation assurée. Capacité à travailler tôt le matin. Sens du contact client apprécié.',
    salary: '900-1200€ selon niveau + formation prise en charge',
    benefits: 'Formation complète, environnement familial, possibilité d\'évolution, produits offerts',
    mentorId: 'mentor-antoine-boulanger',
    imageUrl: getAssetUrl('annonces', 'annonce-boulangerie'),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    active: true
  },
  {
    id: 'annonce-vendeur-epicerie',
    title: 'Vendeur Conseil en Épicerie Fine',
    description: 'Notre épicerie fine recherche un vendeur passionné par les produits du terroir pour conseiller notre clientèle. Vous serez en charge de l\'accueil client, de la présentation des produits et de la transmission de votre passion pour la gastronomie française.',
    company: 'L\'Épicerie du Terroir',
    location: 'Bordeaux Centre, France',
    type: 'cdi',
    requirements: 'Passion pour les produits gastronomiques. Excellent sens relationnel. Connaissance des producteurs locaux appréciée. Présentation soignée obligatoire.',
    salary: '1600-1900€ selon expérience',
    benefits: 'CDI, prime sur objectifs, formation produits, réduction employé 20%',
    mentorId: 'mentor-sophie-epiciere',
    imageUrl: getAssetUrl('annonces', 'annonce-epicerie'),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    active: true
  },
  {
    id: 'annonce-assistant-fleuriste',
    title: 'Assistant Fleuriste Créatif - Stage',
    description: 'Stage de 6 mois dans notre atelier floral créatif. Vous apprendrez les techniques de composition, la préparation des fleurs et l\'accompagnement clientèle. Opportunité unique de développer votre créativité dans un environnement artistique stimulant.',
    company: 'Atelier Floral Créatif',
    location: 'Marseille 6ème, France',
    type: 'stage',
    requirements: 'Étudiant en art floral ou reconversion. Créativité et sens artistique. Minutie et patience. Intérêt pour le contact client.',
    salary: 'Gratification stage légale + formation',
    benefits: 'Formation technique complète, environnement créatif, possibilité d\'embauche',
    mentorId: 'mentor-marie-fleuriste',
    imageUrl: getAssetUrl('annonces', 'annonce-fleuriste'),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    active: true
  },
  {
    id: 'annonce-boucher-qualifie',
    title: 'Boucher Qualifié - Techniques Traditionnelles',
    description: 'Boucherie familiale recherche boucher expérimenté pour rejoindre notre équipe. Vous maîtriserez la découpe traditionnelle, le conseil clientèle et la mise en valeur des produits. Ambiance familiale dans une boucherie réputée du centre-ville.',
    company: 'Boucherie Rousseau & Fils',
    location: 'Toulouse Centre, France',
    type: 'cdi',
    requirements: 'CAP Boucher ou équivalent. Minimum 2 ans d\'expérience. Maîtrise découpe traditionnelle. Excellent relationnel client. Respect des normes d\'hygiène.',
    salary: '1800-2200€ selon expérience + primes',
    benefits: 'CDI, primes performance, formation continue, bonne ambiance équipe',
    mentorId: 'mentor-paul-boucher',
    imageUrl: getAssetUrl('annonces', 'annonce-boucherie'),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    active: true
  },
  {
    id: 'annonce-libraire-temps-partiel',
    title: 'Libraire Temps Partiel - Littérature Spécialisée',
    description: 'Librairie indépendante cherche libraire passionné pour 25h/semaine. Conseil clientèle, gestion des commandes, animation d\'événements littéraires. Idéal pour étudiant en lettres ou passionné de littérature souhaitant une première expérience.',
    company: 'Librairie L\'Encre & La Plume',
    location: 'Nantes Centre, France',
    type: 'cdd',
    requirements: 'Passion pour la littérature. Excellente culture générale. Sens du conseil et de l\'écoute. Disponibilité week-ends. Étudiant accepté.',
    salary: '1200€ temps partiel (25h/semaine)',
    benefits: 'Horaires flexibles, réduction livres 30%, ambiance culturelle',
    mentorId: 'mentor-clara-libraire',
    imageUrl: getAssetUrl('annonces', 'annonce-librairie'),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    active: true
  },
  {
    id: 'annonce-serveur-cuisinier',
    title: 'Serveur-Cuisinier Bistrot Local',
    description: 'Notre bistrot de quartier recherche un profil polyvalent serveur-cuisinier. Cuisine bistrot moderne avec produits locaux. Poste évolutif dans une équipe soudée, ambiance décontractée et clientèle fidèle. Formation assurée selon profil.',
    company: 'Le Bistrot du Quartier',
    location: 'Lille Vieux-Lille, France',
    type: 'cdi',
    requirements: 'Expérience service ou cuisine appréciée. Polyvalence et adaptabilité. Sens du contact client. Capacité à travailler en équipe. Passion pour la restauration.',
    salary: '1650-1850€ + pourboires + primes',
    benefits: 'CDI, équipe jeune, formation évolutive, repas offerts, pourboires',
    mentorId: 'mentor-julien-restaurateur',
    imageUrl: getAssetUrl('annonces', 'annonce-restaurant'),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    active: true
  },
  {
    id: 'annonce-formation-reconversion',
    title: 'Formation Reconversion Commerce-Artisanat',
    description: 'Programme complet d\'accompagnement pour votre reconversion vers les métiers du commerce et de l\'artisanat. Bilan de compétences, formation pratique, mise en réseau et suivi personnalisé sur 6 mois. Financements possibles.',
    company: 'Nouveau Départ Coaching',
    location: 'Strasbourg, France',
    type: 'formation',
    requirements: 'Projet de reconversion défini. Motivation et engagement sur 6 mois. Tous profils acceptés. Entretien de motivation obligatoire.',
    salary: 'Financements CPF, Pôle Emploi, Région possibles',
    benefits: 'Accompagnement personnalisé, réseau professionnel, suivi post-formation',
    mentorId: 'mentor-isabelle-coach',
    imageUrl: getAssetUrl('annonces', 'annonce-formation'),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    active: true
  }
];

// Sample applications data
const APPLICATIONS_DATA = [
  {
    id: 'app-nathaniel-boulangerie',
    moltId: 'molt-nathaniel-dev',
    annonceId: 'annonce-apprenti-boulanger',
    mentorId: 'mentor-antoine-boulanger',
    customMessage: 'Bonjour Antoine, bien que développeur de formation, je souhaite me reconvertir vers l\'artisanat boulanger. Votre approche traditionnelle m\'inspire et je suis prêt à apprendre avec passion.',
    status: 'pending',
    applicationDate: Timestamp.now(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'app-clara-epicerie',
    moltId: 'molt-clara-designer',
    annonceId: 'annonce-vendeur-epicerie',
    mentorId: 'mentor-sophie-epiciere',
    customMessage: 'Bonjour Sophie, passionnée de gastronomie et forte de mon expérience client en design, je souhaite rejoindre votre équipe pour allier passion culinaire et conseil personnalisé.',
    status: 'reviewed',
    applicationDate: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
    createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.now()
  },
  {
    id: 'app-sophie-fleuriste',
    moltId: 'molt-sophie-mobile',
    annonceId: 'annonce-assistant-fleuriste',
    mentorId: 'mentor-marie-fleuriste',
    status: 'accepted',
    applicationDate: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
    createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  },
  {
    id: 'app-thomas-restaurant',
    moltId: 'molt-thomas-marketing',
    annonceId: 'annonce-serveur-cuisinier',
    mentorId: 'mentor-julien-restaurateur',
    customMessage: 'Bonjour Julien, mon expérience marketing me donne une excellente compréhension client. Je souhaite découvrir la restauration et apporter ma polyvalence à votre équipe.',
    status: 'pending',
    applicationDate: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)), // 1 day ago
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  },
  {
    id: 'app-alice-librairie',
    moltId: 'molt-alice-gestion',
    annonceId: 'annonce-libraire-temps-partiel',
    mentorId: 'mentor-clara-libraire',
    status: 'pending',
    applicationDate: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)), // 3 days ago
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  },
  {
    id: 'app-maxime-boucherie',
    moltId: 'molt-maxime-commerce',
    annonceId: 'annonce-boucher-qualifie',
    mentorId: 'mentor-paul-boucher',
    customMessage: 'Bonjour Paul, ma solide expérience commerciale et ma passion pour les produits de qualité font de moi le candidat idéal pour rejoindre votre boucherie familiale.',
    status: 'reviewed',
    applicationDate: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)), // 4 days ago
    createdAt: Timestamp.fromDate(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  },
  {
    id: 'app-julien-formation',
    moltId: 'molt-julien-pm',
    annonceId: 'annonce-formation-reconversion',
    mentorId: 'mentor-isabelle-coach',
    customMessage: 'Bonjour Isabelle, après 5 ans en gestion de projet digital, je souhaite me reconvertir vers l\'artisanat. Votre programme semble parfait pour structurer cette transition.',
    status: 'accepted',
    applicationDate: Timestamp.fromDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)), // 6 days ago
    createdAt: Timestamp.fromDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  }
];

// Articles data
const ARTICLES_DATA = [
  {
    id: 'article-reconversion-peurs',
    title: '5 peurs courantes avant une reconversion et comment les dépasser',
    date: new Date().toISOString(),
    content: `Changer de voie professionnelle est une aventure aussi exaltante qu'angoissante. Avant même de franchir le pas, de nombreuses peurs surgissent et peuvent paralyser nos projets les plus ambitieux.

## 1. La peur de l'échec

Cette peur est naturelle mais ne doit pas vous empêcher d'avancer. Rappelez-vous que l'échec fait partie de l'apprentissage. Chaque échec vous rapproche du succès.

## 2. La peur du jugement des autres

Votre entourage peut ne pas comprendre votre choix. Restez focalisé sur vos objectifs et entourez-vous de personnes bienveillantes qui vous soutiennent.

## 3. La peur de l'instabilité financière

Planifiez votre transition en constituant une épargne de sécurité et en vous formant progressivement avant de franchir le cap.

## 4. La peur de ne pas avoir les compétences

Les compétences s'acquièrent ! Identifiez vos besoins de formation et commencez dès aujourd'hui votre apprentissage.

## 5. La peur de l'âge

Il n'y a pas d'âge pour se reconvertir. Votre expérience est un atout précieux que vous pourrez valoriser dans votre nouveau métier.`,
    auteur: 'Admin Molty',
    imageUrl: '/image.png',
    meta: {
      title: '5 peurs courantes avant une reconversion et comment les dépasser',
      description: 'Comment surmonter les peurs avant une reconversion professionnelle ? Nos conseils pour franchir sereinement le cap vers votre nouvelle carrière.',
      keywords: ['reconversion', 'peurs', 'changement', 'carrière', 'développement personnel']
    },
    adminId: 'admin-molty-platform',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    publishedAt: Timestamp.now(),
    draft: false
  },
  {
    id: 'article-temoignages-commercants',
    title: 'Oser se lancer : témoignages de commerçants qui ont réussi',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    content: `Ils ont franchi le cap et ouvert leur commerce de proximité. Découvrez leurs parcours inspirants et leurs conseils pour réussir votre projet entrepreneurial.

## Marie, 35 ans - De comptable à boulangère à Lyon

"J'ai quitté mon poste de comptable à 35 ans pour reprendre une boulangerie. Le plus dur était de convaincre ma banque, mais aujourd'hui je ne regrette rien ! Mes clients sont devenus des amis, et je me lève chaque matin avec le sourire."

**Son conseil :** "Préparez minutieusement votre business plan et n'hésitez pas à vous former avant de vous lancer."

## Pierre, 42 ans - Passionné devenu libraire à Bordeaux

"Passionné de littérature depuis toujours, j'ai transformé ma passion en métier. Ma librairie spécialisée en BD cartonne auprès des jeunes du quartier. L'investissement personnel est énorme, mais la satisfaction incomparable."

**Son conseil :** "Trouvez votre niche et créez une vraie relation avec vos clients. Le commerce de proximité, c'est avant tout de l'humain."

## Camille, 38 ans - De l'informatique à l'art floral à Nantes

"Après 10 ans dans l'informatique, j'avais besoin de travailler avec mes mains. Mon petit atelier floral me rend heureuse chaque jour. Les mariages, les événements... je crée du bonheur !"

**Son conseil :** "Écoutez-vous vraiment. Si vous avez une passion, donnez-vous les moyens de la réaliser."`,
    auteur: 'Admin Molty',
    imageUrl: '/image.png',
    meta: {
      title: 'Oser se lancer : témoignages de commerçants qui ont réussi',
      description: 'Témoignages inspirants de commerçants qui ont réussi leur reconversion. Conseils et retours d\'expérience pour votre projet.',
      keywords: ['témoignages', 'commerçants', 'entrepreneuriat', 'commerce de proximité', 'reconversion']
    },
    adminId: 'admin-molty-platform',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    draft: false
  },
  {
    id: 'article-choisir-local-commercial',
    title: 'Comment bien choisir son local commercial ? Guide complet',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    content: `Le choix de votre local commercial est crucial pour le succès de votre entreprise. Voici les critères essentiels à prendre en compte pour faire le bon choix.

## L'emplacement : critère numéro 1

### Visibilité et accessibilité
- Visibilité depuis la rue principale
- Accessibilité en transports en commun
- Facilité de stationnement pour vos clients
- Proximité avec votre clientèle cible

### L'environnement commercial
- Présence de commerces complémentaires
- Dynamisme du quartier
- Projets d'aménagement urbain futurs
- Concurrence directe dans la zone

## La configuration du local

### Aspects techniques
- Surface adaptée à votre activité
- Possibilité d'aménagement selon vos besoins
- Conformité aux normes d'accessibilité
- État général du bâtiment et isolation

### Contraintes légales
- Zonage et règlements d'urbanisme
- Autorisations nécessaires pour votre activité
- Normes de sécurité spécifiques

## Les aspects financiers

### Coûts directs
- Loyer en adéquation avec votre budget
- Charges et taxes locales
- Dépôt de garantie et frais d'agence
- Travaux de mise aux normes nécessaires

### Négociation du bail
- Durée du bail et conditions de renouvellement
- Clause de résiliation anticipée
- Révision des loyers
- Répartition des travaux entre bailleur et locataire

## Notre check-list pour visiter

✅ Trafic piéton aux différents moments de la journée  
✅ Facilité de livraison et déchargement  
✅ État des réseaux (électricité, plomberie, internet)  
✅ Voisinage et ambiance du quartier  
✅ Potentiel d'évolution de la zone`,
    auteur: 'Admin Molty',
    imageUrl: '/image.png',
    meta: {
      title: 'Comment bien choisir son local commercial ? Guide complet',
      description: 'Comment choisir son local commercial ? Guide complet avec critères, conseils négociation et check-list pour faire le bon choix.',
      keywords: ['local commercial', 'emplacement', 'business', 'immobilier', 'entrepreneuriat']
    },
    adminId: 'admin-molty-platform',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    draft: false
  },
  {
    id: 'article-premiers-clients',
    title: 'Trouver ses premiers clients : conseils pratiques pour démarrer',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    content: `Attirer et fidéliser une clientèle locale dès l'ouverture : nos astuces concrètes pour démarrer sur de bonnes bases et créer une communauté fidèle.

## Avant l'ouverture : créer l'attente

### Communication digitale
- Créez du buzz sur les réseaux sociaux
- Lancez un compte Instagram avec du contenu régulier
- Annoncez votre ouverture sur les groupes locaux Facebook
- Créez un site web simple avec vos informations

### Marketing de proximité
- Distribuez des flyers dans le quartier
- Nouez des partenariats avec d'autres commerçants
- Participez aux événements locaux et marchés
- Contactez la presse locale pour un article

## Les premiers jours : soigner l'impression

### Offre de lancement
- Proposez une promotion attractive (mais pas braderie)
- Organisez une journée portes ouvertes
- Offrez un petit cadeau ou échantillon
- Créez un événement d'inauguration

### Accueil client
- Soignez particulièrement l'accueil et le service
- Présentez-vous personnellement aux nouveaux clients
- Expliquez votre concept et vos valeurs
- Demandez les coordonnées pour créer votre base client

## Fidélisation à long terme

### Programme de fidélité
- Mettez en place un système de points ou tampons
- Récompensez les clients réguliers
- Proposez des offres personnalisées
- Créez des événements exclusifs pour les fidèles

### Animation continue
- Organisez des événements réguliers (dégustations, ateliers)
- Restez actif sur les réseaux sociaux
- Participez à la vie du quartier
- Collaborez avec d'autres commerçants

## Le bouche-à-oreille, votre meilleur allié

### Créer l'expérience
Un client satisfait en amène trois autres. Misez tout sur :
- La qualité de votre service
- L'originalité de votre offre  
- La proximité et la convivialité
- La régularité dans l'excellence

### Gérer les avis
- Encouragez les avis positifs sur Google et réseaux
- Répondez professionnellement aux critiques
- Utilisez les retours pour vous améliorer
- Affichez vos meilleurs témoignages

## Mesurer et ajuster

Suivez vos résultats :
- Nombre de nouveaux clients par semaine
- Taux de retour des clients
- Chiffre d'affaires par client
- Sources d'acquisition les plus efficaces`,
    auteur: 'Admin Molty',
    imageUrl: '/image.png',
    meta: {
      title: 'Trouver ses premiers clients : conseils pratiques pour démarrer',
      description: 'Conseils pratiques pour trouver ses premiers clients et fidéliser sa clientèle locale. Stratégies marketing pour commerces de proximité.',
      keywords: ['clients', 'marketing', 'fidélisation', 'commerce', 'ouverture', 'communication']
    },
    adminId: 'admin-molty-platform',
    createdAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    updatedAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
    draft: false
  }
];

async function seedCollection(db, collectionName, data, description) {
  console.log(`\n📋 Seeding ${description}...`);
  
  const results = { created: 0, updated: 0, errors: 0 };
  
  for (const item of data) {
    try {
      const { id, ...itemData } = item;
      
      const docRef = db.collection(collectionName).doc(id);
      const existingDoc = await docRef.get();
      
      if (existingDoc.exists) {
        await docRef.update(itemData);
        results.updated++;
        console.log(`   ♻️  Mis à jour: ${item.name || item.title || id}`);
      } else {
        await docRef.set(itemData);
        results.created++;
        console.log(`   ✨ Créé: ${item.name || item.title || id}`);
      }
    } catch (error) {
      results.errors++;
      console.error(`   ❌ Erreur pour ${item.id}:`, error.message);
    }
  }
  
  console.log(`   📊 ${description}: ${results.created} créés, ${results.updated} mis à jour, ${results.errors} erreurs`);
  return results;
}

async function seedComplete() {
  console.log('🚀 DÉBUT DU SEEDING COMPLET - MOLTY DATABASE');
  console.log('🌱 Création de données réalistes et cohérentes\n');
  
  try {
    // Initialize Firebase Admin
    if (!process.env.PROJECT_ID || !process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
      throw new Error('Variables d\'environnement Firebase manquantes');
    }

    const app = initializeApp({
      credential: cert(serviceAccount)
    });

    const db = getFirestore(app);
    
    console.log(`📡 Connecté au projet Firebase: ${process.env.PROJECT_ID}`);
    
    if (Object.keys(assetMapping).length === 0) {
      console.log('⚠️  Attention: Aucun asset mapping trouvé. Exécutez uploadAssets.js d\'abord pour optimiser les images.');
    } else {
      console.log('✅ Asset mapping chargé - Images optimisées disponibles');
    }

    // Track overall results
    const overallResults = {
      totalCreated: 0,
      totalUpdated: 0,
      totalErrors: 0
    };

    // Seed collections in order
    const collections = [
      { name: 'users', data: [ADMIN_USER], description: 'Administrateur' },
      { name: 'users', data: MENTORS_DATA, description: 'Mentors', append: true },
      { name: 'users', data: MOLTS_DATA, description: 'Molts', append: true },
      { name: 'annonces', data: ANNONCES_DATA, description: 'Annonces' },
      { name: 'applications', data: APPLICATIONS_DATA, description: 'Candidatures' },
      { name: 'articles', data: ARTICLES_DATA, description: 'Articles' }
    ];

    for (const collection of collections) {
      const results = await seedCollection(db, collection.name, collection.data, collection.description);
      overallResults.totalCreated += results.created;
      overallResults.totalUpdated += results.updated;
      overallResults.totalErrors += results.errors;
    }

    // Final verification and report
    console.log('\n🔍 VÉRIFICATION DES DONNÉES...');
    
    const verifications = [
      { collection: 'users', expected: 15, description: 'Utilisateurs (1 admin + 7 mentors + 7 molts)' },
      { collection: 'annonces', expected: 7, description: 'Annonces (1 par mentor)' },
      { collection: 'applications', expected: 7, description: 'Candidatures' },
      { collection: 'articles', expected: 4, description: 'Articles de blog' }
    ];

    for (const verification of verifications) {
      const snapshot = await db.collection(verification.collection).get();
      const actual = snapshot.size;
      const status = actual === verification.expected ? '✅' : '⚠️';
      console.log(`   ${status} ${verification.description}: ${actual}/${verification.expected}`);
    }

    // Business logic verification
    console.log('\n🔍 VÉRIFICATION DE LA LOGIQUE MÉTIER...');
    
    // Check 1: Each mentor has max 1 annonce
    const mentorAnnonceCount = {};
    const annoncesSnapshot = await db.collection('annonces').get();
    annoncesSnapshot.forEach(doc => {
      const mentorId = doc.data().mentorId;
      mentorAnnonceCount[mentorId] = (mentorAnnonceCount[mentorId] || 0) + 1;
    });
    
    const maxAnnoncesPerMentor = Math.max(...Object.values(mentorAnnonceCount));
    console.log(`   ${maxAnnoncesPerMentor <= 1 ? '✅' : '❌'} Max 1 annonce par mentor: ${maxAnnoncesPerMentor} max trouvé`);
    
    // Check 2: All applications reference existing users and annonces
    const applicationsSnapshot = await db.collection('applications').get();
    let validApplications = 0;
    
    for (const appDoc of applicationsSnapshot.docs) {
      const app = appDoc.data();
      const moltExists = await db.collection('users').doc(app.moltId).get();
      const annonceExists = await db.collection('annonces').doc(app.annonceId).get();
      
      if (moltExists.exists && annonceExists.exists) {
        validApplications++;
      }
    }
    
    console.log(`   ${validApplications === applicationsSnapshot.size ? '✅' : '❌'} Intégrité des candidatures: ${validApplications}/${applicationsSnapshot.size} valides`);

    // Final summary
    console.log('\n📊 RAPPORT FINAL DE SEEDING');
    console.log('==============================');
    console.log(`🎯 Total créé: ${overallResults.totalCreated}`);
    console.log(`♻️  Total mis à jour: ${overallResults.totalUpdated}`);
    console.log(`❌ Total erreurs: ${overallResults.totalErrors}`);
    
    console.log('\n👥 COMPTES CRÉÉS:');
    console.log('   👑 1 Admin: admin@molty.fr');
    console.log('   🏢 7 Mentors: boulanger, épicière, fleuriste, boucher, libraire, restaurateur, coach');
    console.log('   💼 7 Molts: développeurs, designer, chef de projet, marketing, gestion, commercial');
    
    console.log('\n🏪 DONNÉES MÉTIER:');
    console.log('   📝 7 Annonces actives (1 par mentor)');
    console.log('   📋 7 Candidatures avec statuts variés');
    console.log('   📰 4 Articles de blog publiés');
    
    console.log('\n🚀 BASE DE DONNÉES PRÊTE !');
    console.log('✅ Vous pouvez maintenant tester la plateforme avec des données réalistes');
    console.log('🔗 Utilisez Google OAuth pour vous connecter avec les emails mentionnés\n');
    
    process.exit(overallResults.totalErrors > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('💥 ERREUR CRITIQUE lors du seeding:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

seedComplete();