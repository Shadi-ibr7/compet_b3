export interface IAnnonce {
  id?: string;
  date: Date;
  type: string;
  nomEtablissement: string;
  nomMetier: string;
  description: string;
  localisation: string;
  imageUrl?: string;
  mentorId: string;  // Référence à l'ID du mentor plutôt qu'à l'objet complet
}
