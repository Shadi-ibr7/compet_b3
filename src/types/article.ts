export interface Article {
    id?: string; // Ajouté automatiquement à la lecture du document
    title: string;
    date: string; // ISO string (Date.toISOString())
    content?: string;
    auteur: string;
    lienPodcast?: string;
    meta: {
      title: string;
      description: string;
      keywords?: string[];
    };
}