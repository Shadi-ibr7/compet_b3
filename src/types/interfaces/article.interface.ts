export interface IArticle {
  id?: string;
  title: string;
  date: string;
  content?: string;
  auteur: string;
  lienPodcast?: string;
  imageUrl: string; // URL de l'image de couverture de l'article
  meta: {
    title: string;
    description: string;
    keywords?: string[];
  };
  adminId: string;  // Référence à l'ID de l'admin plutôt qu'à l'objet complet
}