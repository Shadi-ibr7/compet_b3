import emailjs from '@emailjs/browser';
import type { IMolt } from '@/types/interfaces/molt.interface';
import type { IAnnonce } from '@/types/interfaces/annonce.interface';
import type { IMentor } from '@/types/interfaces/mentor.interface';

// Configuration EmailJS depuis les variables d'environnement
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export interface EmailParams extends Record<string, unknown> {
  to_email: string;
  to_name: string;
  from_name: string;
  molt_name: string;
  molt_initial: string;
  molt_email: string;
  molt_city: string;
  molt_job_title: string;
  molt_motivation: string;
  molt_linkedin: string;
  molt_experiences: string;
  annonce_title: string;
  annonce_company: string;
  annonce_location: string;
  annonce_description: string;
  application_date: string;
  subject: string;
  custom_message?: string;
}

/**
 * Envoie un email de candidature au mentor via EmailJS
 * @param moltProfile - Profil du Molt qui postule
 * @param annonce - Annonce pour laquelle le Molt postule
 * @param mentor - Mentor qui recevra l'email
 * @returns Promise<boolean> - true si l'email a été envoyé avec succès
 */
export async function sendApplicationEmail(
  moltProfile: IMolt,
  annonce: IAnnonce,
  mentor: IMentor,
  customMessage?: string
): Promise<boolean> {
  try {
    console.log('📧 === DÉBUT ENVOI EMAIL ===');
    console.log('📋 Données reçues:');
    console.log(`   Molt: ${moltProfile?.name || 'UNDEFINED'} (${moltProfile?.email || 'UNDEFINED'})`);
    console.log(`   Annonce: ${annonce?.nomMetier || 'UNDEFINED'} - ${annonce?.nomEtablissement || 'UNDEFINED'}`);
    console.log(`   Mentor: ${mentor?.nom || mentor?.name || 'UNDEFINED'} (${mentor?.email || 'UNDEFINED'})`);

    // Validation des données requises
    if (!mentor) {
      console.error('❌ Erreur: Mentor non défini');
      throw new Error('Mentor non défini');
      console.log('❌ Objet mentor est null ou undefined');
      throw new Error('Informations du mentor non disponibles');
    }

    if (!mentor.email) {
      console.error('❌ Erreur: Email du mentor non disponible');
      console.error('📧 Données du mentor:', mentor);
      console.log('❌ Email du mentor manquant');
      console.log('📋 Objet mentor reçu:', JSON.stringify(mentor, null, 2));
      throw new Error('Email du mentor non disponible');
    }

    // Vérifier que l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mentor.email)) {
      console.log(`❌ Email mentor invalide: "${mentor.email}"`);
      throw new Error('Le mentor n\'a pas d\'email valide configuré');
    }

    if (!moltProfile.name) {
      console.log('❌ Nom du candidat manquant');
      throw new Error('Nom du candidat requis');
    }

    console.log('✅ Toutes les validations passées');

    // Formatage des expériences pour l'email
    const experiencesText = moltProfile.experiences && moltProfile.experiences.length > 0
      ? moltProfile.experiences.map(exp => {
          const title = exp.position || (exp.type === 'education' ? 'Formation' : 'Expérience professionnelle');
          const place = exp.institution || 'Institution non renseignée';
          const period = exp.startDate ? `(${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - en cours'})` : '';
          return `• ${title} - ${place} ${period}`;
        }).join('\n')
      : 'Aucune expérience renseignée';

    // Préparation des paramètres pour le template EmailJS
    const emailParams: EmailParams = {
      to_email: mentor.email, // Email du mentor
      to_name: mentor.nom,
      from_name: moltProfile.name,
      molt_name: moltProfile.name,
      molt_initial: moltProfile.name ? moltProfile.name.charAt(0).toUpperCase() : 'M',
      molt_email: moltProfile.email || 'Email non renseigné',
      molt_city: moltProfile.city || 'Ville non renseignée',
      molt_job_title: moltProfile.jobTitle || 'Poste non renseigné',
      molt_motivation: moltProfile.motivation || 'Motivation non renseignée',
      molt_linkedin: moltProfile.linkedin || 'LinkedIn non renseigné',
      molt_experiences: experiencesText,
      annonce_title: annonce.nomMetier,
      annonce_company: annonce.nomEtablissement,
      annonce_location: annonce.localisation,
      annonce_description: annonce.description,
      application_date: new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date()),
      subject: `🎯 Nouvelle candidature Molty : ${moltProfile.name} pour ${annonce.nomMetier} - ${annonce.nomEtablissement}`,
      custom_message: customMessage && customMessage.trim() ? customMessage.trim() : "Aucun message personnalisé"
    };

    console.log('📤 Envoi de l\'email via EmailJS...');
    console.log('📋 Paramètres email:');
    console.log(`   TO: ${emailParams.to_email}`);
    console.log(`   FROM: ${emailParams.from_name}`);
    console.log(`   SUBJECT: ${emailParams.subject}`);
    console.log(`   SERVICE_ID: ${EMAILJS_SERVICE_ID ? 'SET' : 'MISSING'}`);
    console.log(`   TEMPLATE_ID: ${EMAILJS_TEMPLATE_ID ? 'SET' : 'MISSING'}`);
    console.log(`   PUBLIC_KEY: ${EMAILJS_PUBLIC_KEY ? 'SET' : 'MISSING'}`);

    // Envoi de l'email via EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Email envoyé avec succès!');
    console.log('📋 Résultat EmailJS:', result);
    console.log('📧 === FIN ENVOI EMAIL ===');
    return true;

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}

/**
 * Vérifie si EmailJS est correctement configuré
 * @returns boolean - true si la configuration est valide
 */
export function isEmailJSConfigured(): boolean {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
}