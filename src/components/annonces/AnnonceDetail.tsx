'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { sendApplicationEmail, isEmailJSConfigured } from "@/lib/emailService";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import type { IMolt } from "@/types/interfaces/molt.interface";
import styles from "./AnnonceDetail.module.css";

interface AnnonceDetailProps {
  annonce: IAnnonce;
  mentor: IMentor | null;
}

const AnnonceDetail = ({ annonce, mentor }: AnnonceDetailProps) => {
  const { data: session, status } = useSession();
  const [moltProfile, setMoltProfile] = useState<IMolt | null>(null);
  const [isLoadingPaidStatus, setIsLoadingPaidStatus] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Récupérer le profil Molt pour vérifier le statut paid
  useEffect(() => {
    const fetchMoltProfile = async () => {
      if (session?.user?.id && session.user.role === 'molt') {
        setIsLoadingPaidStatus(true);
        try {
          const response = await fetch(`/api/molts/${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setMoltProfile(data);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du profil Molt:', error);
        } finally {
          setIsLoadingPaidStatus(false);
        }
      }
    };

    fetchMoltProfile();
  }, [session?.user?.id, session?.user?.role]);

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  // Logic for application authorization
  const getApplicationStatus = () => {
    if (status === 'loading' || isLoadingPaidStatus) {
      return { canApply: false, message: 'Chargement...', type: 'loading' };
    }

    if (!session?.user) {
      return { 
        canApply: false, 
        message: 'Connectez-vous pour postuler à cette offre', 
        type: 'login',
        action: '/auth/signin'
      };
    }

    if (session.user.role !== 'molt') {
      return { 
        canApply: false, 
        message: 'Devenez membre Molt pour accéder aux opportunités', 
        type: 'upgrade',
        action: '/auth/signup'
      };
    }

    // Vérifier le statut paid du profil Molt
    const isPaid = moltProfile?.paid ?? false;
    
    if (!isPaid) {
      return { 
        canApply: false, 
        message: 'Passez à Molty Premium pour postuler aux offres', 
        type: 'payment',
        action: '/payment'
      };
    }

    return { canApply: true, message: 'Postuler à cette offre', type: 'success' };
  };

  const applicationStatus = getApplicationStatus();

  const handleApplication = async () => {
    console.log('🚀 === DÉBUT CANDIDATURE ===');
    console.log('📋 État de la candidature:', applicationStatus);
    
    if (!applicationStatus.canApply) {
      console.log('❌ Candidature non autorisée, redirection...');
      if (applicationStatus.action) {
        window.location.href = applicationStatus.action;
      }
      return;
    }

    // Vérifications avant envoi
    console.log('🔍 Vérification des données:');
    console.log(`   Molt profile: ${moltProfile ? '✅' : '❌'}`);
    console.log(`   Mentor: ${mentor ? '✅' : '❌'}`);
    console.log(`   Mentor email: ${mentor?.email || 'UNDEFINED'}`);
    
    if (!moltProfile || !mentor) {
      console.log('❌ Données manquantes pour la candidature');
      setApplicationMessage({
        type: 'error',
        text: 'Données manquantes pour envoyer la candidature'
      });
      return;
    }

    if (!isEmailJSConfigured()) {
      setApplicationMessage({
        type: 'error',
        text: 'Service d\'email non configuré'
      });
      return;
    }

    setIsApplying(true);
    setApplicationMessage(null);

    try {
      console.log('📤 Appel de sendApplicationEmail...');
      await sendApplicationEmail(moltProfile, annonce, mentor);
      
      console.log('✅ Email envoyé avec succès depuis le composant');
      setApplicationMessage({
        type: 'success',
        text: 'Candidature envoyée avec succès ! Le mentor recevra votre profil par email.'
      });

      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setApplicationMessage(null);
      }, 5000);

    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la candidature:', error);
      console.log('🚀 === FIN CANDIDATURE (ERREUR) ===');
      
      setApplicationMessage({
        type: 'error',
        text: 'Erreur lors de l\'envoi de la candidature. Veuillez réessayer.'
      });

      // Masquer le message d'erreur après 8 secondes
      setTimeout(() => {
        setApplicationMessage(null);
      }, 8000);
    } finally {
      setIsApplying(false);
      console.log('🚀 === FIN CANDIDATURE ===');
    }
  };

  // Guard clause après tous les hooks
  if (!annonce) return null;

  return (
    <div className={styles.container}>
      {/* Hero Section - Annonce */}
      <section className={styles.annonceSection}>
        <div className={styles.annonceContent}>
          <div className={styles.annonceHeader}>
            {annonce.imageUrl && (
              <Image 
                src={annonce.imageUrl} 
                alt={`Image pour ${annonce.nomMetier}`} 
                width={300} 
                height={200} 
                className={styles.annonceImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder_article.png';
                }}
              />
            )}
            <div className={styles.annonceInfo}>
              <h1 className={styles.annonceTitle}>{annonce.nomMetier}</h1>
              <div className={styles.annonceCompany}>{annonce.nomEtablissement}</div>
              <div className={styles.annonceDetails}>
                <div className={styles.annonceDetail}>
                  <Image src="/Union.svg" alt="Localisation" width={16} height={20} />
                  <span>{annonce.localisation}</span>
                </div>
                <div className={styles.annonceDetail}>
                  <Image src="/Group.svg" alt="Type" width={16} height={16} />
                  <span>{annonce.type}</span>
                </div>
                <div className={styles.annonceDetail}>
                  <Image src="/Vector.svg" alt="Date" width={16} height={16} />
                  <span>Publié le {formatDate(annonce.date)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.annonceDescription}>
            <h2 className={styles.sectionTitle}>Description du poste</h2>
            <p className={styles.description}>
              {annonce.description}
            </p>
          </div>

          {/* Section Ce que je propose - Conditionnelle */}
          {annonce.ceQueJePropose && annonce.ceQueJePropose.trim() && (
            <div className={styles.annonceDescription}>
              <h2 className={styles.sectionTitle}>Ce que je propose</h2>
              <p className={styles.description}>
                {annonce.ceQueJePropose}
              </p>
            </div>
          )}

          {/* Section Profil recherché - Conditionnelle */}
          {annonce.profilRecherche && annonce.profilRecherche.trim() && (
            <div className={styles.annonceDescription}>
              <h2 className={styles.sectionTitle}>Profil recherché</h2>
              <p className={styles.description}>
                {annonce.profilRecherche}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Mentor Section */}
      {mentor && (
        <section className={styles.mentorSection}>
          <div className={styles.mentorContent}>
            <h2 className={styles.sectionTitle}>Votre mentor pour cette mission</h2>
            <div className={styles.mentorCard}>
              <Link href={`/mentors/${mentor.id}`} className={styles.mentorLink}>
                <Image 
                  src={mentor.linkPhoto || '/placeholder_pp.png'} 
                  alt={`Photo de ${mentor.nom}`} 
                  width={80} 
                  height={80} 
                  className={styles.mentorAvatar}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder_pp.png';
                  }}
                />
                <div className={styles.mentorInfo}>
                  <h3 className={styles.mentorName}>{mentor.nom}</h3>
                  <div className={styles.mentorJob}>{mentor.job}</div>
                  <div className={styles.mentorLocation}>
                    <Image src="/Union.svg" alt="Localisation" width={12} height={14} />
                    <span>{mentor.localisation}</span>
                  </div>
                  {mentor.note && mentor.note > 0 && (
                    <div className={styles.mentorRating}>
                      {'★'.repeat(Math.floor(mentor.note))} ({mentor.note}/5)
                    </div>
                  )}
                </div>
              </Link>
              <div className={styles.mentorDescription}>
                <p>{mentor.description}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Application Section */}
      <section className={styles.applicationSection}>
        <div className={styles.applicationContent}>
          <div className={styles.applicationCard}>
            <h2 className={styles.applicationTitle}>
              {applicationStatus.canApply ? 'Postuler à cette offre' : 'Accès requis'}
            </h2>
            
            {!applicationStatus.canApply && (
              <div className={`${styles.statusMessage} ${styles[applicationStatus.type]}`}>
                <Image 
                  src={
                    applicationStatus.type === 'login' ? '/Vector.svg' :
                    applicationStatus.type === 'upgrade' ? '/Group.svg' :
                    applicationStatus.type === 'payment' ? '/material_symbols_settings.svg' :
                    '/Vector.svg'
                  } 
                  alt="Status" 
                  width={32} 
                  height={32} 
                />
                <p>{applicationStatus.message}</p>
              </div>
            )}

            <button 
              className={`${styles.applicationButton} ${applicationStatus.canApply ? styles.enabled : styles.disabled}`}
              onClick={handleApplication}
              disabled={applicationStatus.type === 'loading' || isApplying}
            >
              {applicationStatus.type === 'loading' || isApplying ? (
                isApplying ? 'Envoi en cours...' : 'Chargement...'
              ) : applicationStatus.canApply ? (
                <>
                  <Image src="/Vector.svg" alt="Postuler" width={20} height={20} />
                  Postuler maintenant
                </>
              ) : applicationStatus.type === 'login' ? (
                'Se connecter'
              ) : applicationStatus.type === 'upgrade' ? (
                'Devenir membre Molt'
              ) : applicationStatus.type === 'payment' ? (
                'Passer à Premium'
              ) : (
                'Continuer'
              )}
            </button>

            {/* Messages de notification */}
            {applicationMessage && (
              <div className={`${styles.notificationMessage} ${styles[applicationMessage.type]}`}>
                <Image 
                  src={applicationMessage.type === 'success' ? '/checkmark.svg' : '/error.svg'} 
                  alt={applicationMessage.type} 
                  width={20} 
                  height={20} 
                />
                <p>{applicationMessage.text}</p>
              </div>
            )}

            {applicationStatus.canApply && (
              <p className={styles.applicationNote}>
                En postulant, vous acceptez que vos informations soient partagées avec le mentor.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className={styles.navigationSection}>
        <Link href="/annonces" className={styles.backButton}>
          <Image src="/mdi-arrow-up.svg" alt="Retour" width={20} height={20} />
          Retour aux annonces
        </Link>
      </section>
    </div>
  );
};

export default AnnonceDetail;