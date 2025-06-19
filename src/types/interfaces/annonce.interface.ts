export interface IAnnonce {
  id?: string;
  date: Date;
  localisation: string;
  description: string;
  mentorId: string;  // Référence à l'ID du mentor plutôt qu'à l'objet complet
}
