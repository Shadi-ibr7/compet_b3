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
 * Enregistre une candidature en base de données
 * @param moltId - ID du Molt candidat
 * @param annonceId - ID de l'annonce
 * @param mentorId - ID du mentor
 * @param customMessage - Message personnalisé optionnel
 * @returns Promise<string> - ID de la candidature créée
 */
async function recordApplication(
  moltId: string,
  annonceId: string,
  mentorId: string,
  customMessage?: string
): Promise<string> {
  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      annonceId,
      mentorId,
      customMessage,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erreur lors de l\'enregistrement de la candidature');
  }

  const data = await response.json();
  return data.application.id;
}

/**
 * Envoie un email de candidature au mentor via EmailJS
 * @param moltProfile - Profil du Molt qui postule
 * @param annonce - Annonce pour laquelle le Molt postule
 * @param mentor - Mentor qui recevra l'email
 * @param customMessage - Message personnalisé optionnel
 * @param moltId - ID du Molt (de la session)
 * @returns Promise<boolean> - true si l'email a été envoyé avec succès
 */
export async function sendApplicationEmail(
  moltProfile: IMolt,
  annonce: IAnnonce,
  mentor: IMentor,
  customMessage?: string,
  moltId?: string
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

    // Étape 1: Enregistrer la candidature en base de données
    console.log('💾 Enregistrement de la candidature...');
    
    const effectiveMoltId = moltId || moltProfile.id;
    if (!effectiveMoltId || !annonce.id) {
      console.error('❌ IDs manquants:', { 
        moltId: effectiveMoltId, 
        annonceId: annonce.id,
        moltProfileId: moltProfile.id,
        sessionMoltId: moltId
      });
      throw new Error('IDs du Molt et de l\'annonce requis');
    }

    let applicationId: string;
    try {
      applicationId = await recordApplication(
        effectiveMoltId,
        annonce.id,
        mentor.id || mentor.email, // Utiliser l'ID mentor ou email comme fallback
        customMessage
      );
      console.log('✅ Candidature enregistrée avec ID:', applicationId);
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      throw new Error('Impossible d\'enregistrer la candidature: ' + (error as Error).message);
    }

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
 * Vérifie si un Molt a déjà postulé à une annonce
 * @param moltId - ID du Molt
 * @param annonceId - ID de l'annonce
 * @returns Promise<boolean> - true si candidature existe
 */
export async function checkApplicationExists(
  moltId: string,
  annonceId: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/applications/check/${moltId}/${annonceId}`);
    
    if (!response.ok) {
      console.error('Erreur lors de la vérification de candidature:', response.status);
      return false; // En cas d'erreur, on autorise (fail-safe)
    }

    const data = await response.json();
    return data.hasApplied;
  } catch (error) {
    console.error('Erreur lors de la vérification de candidature:', error);
    return false; // En cas d'erreur, on autorise (fail-safe)
  }
}

/**
 * Vérifie si EmailJS est correctement configuré
 * @returns boolean - true si la configuration est valide
 */
export function isEmailJSConfigured(): boolean {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
}