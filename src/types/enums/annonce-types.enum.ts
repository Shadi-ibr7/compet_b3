/**
 * Types d'annonces disponibles sur la plateforme Molty
 * Catégorisés par domaine d'activité
 */

export enum AnnonceType {
  // Opportunités d'emploi
  CDI = "CDI",
  CDD = "CDD", 
  STAGE = "Stage",
  ALTERNANCE = "Alternance",
  FREELANCE = "Freelance/Mission",
  
  // Mentorat & Accompagnement
  ECHANGE_CONSEIL = "Échange & Conseil",
  FORMATION = "Formation",
  RECONVERSION = "Reconversion",
  BENEVOLAT = "Bénévolat"
}

/**
 * Configuration des types d'annonces avec leurs labels d'affichage
 */
export const ANNONCE_TYPE_CONFIG = {
  // Opportunités d'emploi
  [AnnonceType.CDI]: {
    label: "CDI - Contrat à Durée Indéterminée",
    category: "Opportunités d'emploi",
    description: "Poste permanent en entreprise"
  },
  [AnnonceType.CDD]: {
    label: "CDD - Contrat à Durée Déterminée", 
    category: "Opportunités d'emploi",
    description: "Contrat temporaire avec durée définie"
  },
  [AnnonceType.STAGE]: {
    label: "Stage",
    category: "Opportunités d'emploi", 
    description: "Stage étudiant ou professionnel"
  },
  [AnnonceType.ALTERNANCE]: {
    label: "Alternance",
    category: "Opportunités d'emploi",
    description: "Contrat d'apprentissage ou professionnalisation"
  },
  [AnnonceType.FREELANCE]: {
    label: "Freelance/Mission",
    category: "Opportunités d'emploi",
    description: "Mission indépendante ou consulting"
  },
  
  // Mentorat & Accompagnement
  [AnnonceType.ECHANGE_CONSEIL]: {
    label: "Échange & Conseil",
    category: "Mentorat & Accompagnement",
    description: "Sessions de mentorat et conseils professionnels"
  },
  [AnnonceType.FORMATION]: {
    label: "Formation", 
    category: "Mentorat & Accompagnement",
    description: "Accompagnement formatif et développement de compétences"
  },
  [AnnonceType.RECONVERSION]: {
    label: "Reconversion Professionnelle",
    category: "Mentorat & Accompagnement", 
    description: "Accompagnement pour changement de carrière"
  },
  [AnnonceType.BENEVOLAT]: {
    label: "Bénévolat",
    category: "Mentorat & Accompagnement",
    description: "Missions bénévoles et associatives"
  }
} as const;

/**
 * Obtient les types d'annonce groupés par catégorie
 */
export function getAnnonceTypesByCategory() {
  const categories: Record<string, Array<{value: string, label: string}>> = {};
  
  Object.entries(ANNONCE_TYPE_CONFIG).forEach(([value, config]) => {
    if (!categories[config.category]) {
      categories[config.category] = [];
    }
    categories[config.category].push({
      value,
      label: config.label
    });
  });
  
  return categories;
}

/**
 * Vérifie si un type d'annonce est valide
 */
export function isValidAnnonceType(type: string): type is AnnonceType {
  return Object.values(AnnonceType).includes(type as AnnonceType);
}