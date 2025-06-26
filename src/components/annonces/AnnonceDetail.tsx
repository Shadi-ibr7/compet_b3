'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { sendApplicationEmail, isEmailJSConfigured, checkApplicationExists } from "@/lib/emailService";
import { getMentorRating } from "@/lib/ratingService";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import type { IMolt } from "@/types/interfaces/molt.interface";
import type { IMentorRating } from "@/types/interfaces/rating.interface";
import RatingDisplay from "@/components/rating/RatingDisplay";
import SafeHtml from "@/components/Security/SafeHtml";
import { sanitizeTextMessage } from "@/lib/security";
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
  const [customMessage, setCustomMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [isCheckingApplication, setIsCheckingApplication] = useState(false);
  const [mentorRating, setMentorRating] = useState<IMentorRating | null>(null);

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

  // Vérifier si l'utilisateur a déjà postulé
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!session?.user?.id || !annonce.id || session.user.role !== 'molt') {
        return;
      }

      setIsCheckingApplication(true);
      try {
        const applied = await checkApplicationExists(session.user.id, annonce.id);
        setHasApplied(applied);
      } catch (error) {
        console.error('Erreur lors de la vérification de candidature:', error);
      } finally {
        setIsCheckingApplication(false);
      }
    };

    checkExistingApplication();
  }, [session?.user?.id, annonce.id, session?.user?.role]);

  // Récupérer la note du mentor
  useEffect(() => {
    const fetchMentorRating = async () => {
      if (mentor?.id) {
        const rating = await getMentorRating(mentor.id);
        setMentorRating(rating);
      }
    };

    fetchMentorRating();
  }, [mentor?.id]);

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
    if (status === 'loading' || isLoadingPaidStatus || isCheckingApplication) {
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

    if (hasApplied) {
      return { 
        canApply: false, 
        message: 'Candidature déjà envoyée ✓', 
        type: 'already-applied' 
      };
    }

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
      await sendApplicationEmail(moltProfile, annonce, mentor, customMessage, session?.user?.id);
      
      console.log('✅ Email envoyé avec succès depuis le composant');
      setApplicationMessage({
        type: 'success',
        text: 'Candidature envoyée avec succès ! Le mentor recevra votre profil par email.'
      });

      setHasApplied(true);

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

      setTimeout(() => {
        setApplicationMessage(null);
      }, 8000);
    } finally {
      setIsApplying(false);
      console.log('🚀 === FIN CANDIDATURE ===');
    }
  };

  if (!annonce) return null;

  const daysSincePosted = Math.floor((new Date().getTime() - new Date(annonce.date).getTime()) / (1000 * 3600 * 24));
  const isRecent = daysSincePosted <= 7;

  return (
    <div className={styles.container}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumbNav} aria-label="Navigation">
        <div className={styles.breadcrumbContent}>
          <Link href="/annonces" className={styles.breadcrumbLink}>
            <Image src="/mdi-arrow-up.svg" alt="" width={16} height={16} />
            Annonces
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{annonce.nomMetier}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* Job Header */}
          <div className={styles.jobHeader}>
            <div className={styles.jobImageContainer}>
              {annonce.imageUrl ? (
                <Image 
                  src={annonce.imageUrl} 
                  alt={`Image pour ${annonce.nomMetier}`} 
                  width={280} 
                  height={200} 
                  className={styles.jobImage}
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder_article.png';
                  }}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <Image src="/briefcase.svg" alt="" width={48} height={48} />
                </div>
              )}
              {isRecent && (
                <div className={styles.recentBadge}>
                  <span className={styles.recentDot}></span>
                  Nouveau
                </div>
              )}
            </div>
            
            <div className={styles.jobInfo}>
              <div className={styles.jobTitleSection}>
                <h1 className={styles.jobTitle}>{annonce.nomMetier}</h1>
                <div className={styles.companyName}>
                  <Image src="/Group1.svg" alt="" width={16} height={16} />
                  {annonce.nomEtablissement}
                </div>
              </div>
              
              <div className={styles.jobMeta}>
                <div className={styles.metaItem}>
                  <Image src="/Union.svg" alt="Localisation" width={16} height={20} />
                  <span>{annonce.localisation}</span>
                </div>
                <div className={styles.metaItem}>
                  <Image src="/Group.svg" alt="Type" width={16} height={16} />
                  <span>{annonce.type}</span>
                </div>
                <div className={styles.metaItem}>
                  <Image src="/Vector.svg" alt="Date" width={16} height={16} />
                  <span>Publié {daysSincePosted === 0 ? 'aujourd\'hui' : 
                    daysSincePosted === 1 ? 'hier' : 
                    `il y a ${daysSincePosted} jours`}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                <button className={styles.shareButton}>
                  <Image src="/Vector.svg" alt="" width={16} height={16} />
                  Partager
                </button>
                <button className={styles.saveButton}>
                  <Image src="/BookmarkMobile.svg" alt="" width={16} height={16} />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.contentGrid}>
          
          {/* Left Column - Job Details */}
          <div className={styles.leftColumn}>
            <div className={styles.jobDetailsSection}>
              
              {/* Job Description */}
              <div className={styles.detailCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Description du poste</h2>
                  <div className={styles.sectionDivider}></div>
                </div>
                <div className={styles.contentText}>
                  <SafeHtml 
                    html={annonce.description || 'Aucune description disponible pour ce poste.'} 
                    variant="basic"
                    className={styles.htmlContent}
                  />
                </div>
              </div>

              {/* What We Offer */}
              {annonce.ceQueJePropose && annonce.ceQueJePropose.trim() && (
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Ce que nous proposons</h2>
                    <div className={styles.sectionDivider}></div>
                  </div>
                  <div className={styles.contentText}>
                    <SafeHtml 
                      html={annonce.ceQueJePropose} 
                      variant="basic"
                      className={styles.htmlContent}
                    />
                  </div>
                </div>
              )}

              {/* Profile Sought */}
              {annonce.profilRecherche && annonce.profilRecherche.trim() && (
                <div className={styles.detailCard}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Profil recherché</h2>
                    <div className={styles.sectionDivider}></div>
                  </div>
                  <div className={styles.contentText}>
                    <SafeHtml 
                      html={annonce.profilRecherche} 
                      variant="basic"
                      className={styles.htmlContent}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Mentor & Application */}
          <div className={styles.rightColumn}>
            
            {/* Mentor Card */}
            {mentor && (
              <div className={styles.mentorCard}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Votre mentor</h2>
                  <div className={styles.sectionDivider}></div>
                </div>
                
                <Link href={`/mentors/${mentor.id}`} className={styles.mentorProfile}>
                  <div className={styles.mentorAvatarContainer}>
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
                    <div className={styles.mentorBadge}>
                      <Image src="/Vector.svg" alt="" width={12} height={12} />
                    </div>
                  </div>
                  
                  <div className={styles.mentorInfo}>
                    <h3 className={styles.mentorName}>{mentor.nom}</h3>
                    <div className={styles.mentorRole}>
                      <Image src="/briefcase.svg" alt="" width={14} height={14} />
                      {mentor.job}
                    </div>
                    <div className={styles.mentorLocation}>
                      <Image src="/Union.svg" alt="" width={12} height={14} />
                      {mentor.localisation}
                    </div>
                    
                    <div className={styles.mentorRating}>
                      <RatingDisplay 
                        averageRating={mentorRating?.averageRating || null}
                        totalRatings={mentorRating?.totalRatings || 0}
                        showText={true}
                        size="small"
                      />
                    </div>
                  </div>
                </Link>
                
                {mentor.description && (
                  <div className={styles.mentorDescription}>
                    <p>{mentor.description}</p>
                  </div>
                )}
                
                <div className={styles.mentorActions}>
                  <Link href={`/mentors/${mentor.id}`} className={styles.viewProfileBtn}>
                    Voir le profil complet
                    <Image src="/arrow-left.svg" alt="" width={14} height={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* Application Card */}
            <div className={styles.applicationCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {applicationStatus.canApply ? 'Postuler' : 'Accès requis'}
                </h2>
                <div className={styles.sectionDivider}></div>
              </div>
              
              {/* Application Status */}
              <div className={styles.applicationStatus}>
                {!applicationStatus.canApply && (
                  <div className={`${styles.statusAlert} ${styles[applicationStatus.type]}`}>
                    <div className={styles.statusIcon}>
                      <Image 
                        src={
                          applicationStatus.type === 'login' ? '/Vector.svg' :
                          applicationStatus.type === 'upgrade' ? '/Group.svg' :
                          applicationStatus.type === 'payment' ? '/material_symbols_settings.svg' :
                          applicationStatus.type === 'already-applied' ? '/Vector.svg' :
                          '/Vector.svg'
                        } 
                        alt="Status" 
                        width={24} 
                        height={24} 
                      />
                    </div>
                    <div className={styles.statusContent}>
                      <h3 className={styles.statusTitle}>
                        {applicationStatus.type === 'login' ? 'Connexion requise' :
                         applicationStatus.type === 'upgrade' ? 'Compte Molt requis' :
                         applicationStatus.type === 'payment' ? 'Premium requis' :
                         applicationStatus.type === 'already-applied' ? 'Candidature envoyée' :
                         'Action requise'}
                      </h3>
                      <p className={styles.statusMessage}>{applicationStatus.message}</p>
                    </div>
                  </div>
                )}

                {applicationStatus.canApply && (
                  <div className={styles.applicationSuccess}>
                    <div className={styles.successIcon}>
                      <Image src="/Vector.svg" alt="" width={24} height={24} />
                    </div>
                    <div className={styles.successContent}>
                      <h3 className={styles.successTitle}>Prêt à postuler</h3>
                      <p className={styles.successMessage}>Vous pouvez maintenant postuler à cette opportunité</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Message */}
              {applicationStatus.canApply && moltProfile?.paid && (
                <div className={styles.messageSection}>
                  <label htmlFor="customMessage" className={styles.messageLabel}>
                    <Image src="/mail.svg" alt="" width={16} height={16} />
                    Message de motivation (optionnel)
                  </label>
                  <textarea
                    id="customMessage"
                    className={styles.messageTextarea}
                    value={customMessage}
                    onChange={(e) => {
                      try {
                        const sanitizedMessage = sanitizeTextMessage(e.target.value, true);
                        setCustomMessage(sanitizedMessage);
                      } catch (error) {
                        console.warn('Message trop long, troncature appliquée');
                        const truncated = e.target.value.substring(0, 500);
                        setCustomMessage(sanitizeTextMessage(truncated, true));
                      }
                    }}
                    placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé par cette opportunité..."
                    rows={4}
                    maxLength={500}
                  />
                  <div className={styles.characterCount}>
                    {customMessage.length}/500 caractères
                  </div>
                </div>
              )}

              {/* Application Button */}
              <div className={styles.applicationAction}>
                <button 
                  className={`${styles.applicationButton} ${
                    applicationStatus.canApply ? styles.enabled : 
                    applicationStatus.type === 'already-applied' ? styles.alreadyApplied : 
                    styles.disabled
                  }`}
                  onClick={handleApplication}
                  disabled={applicationStatus.type === 'loading' || isApplying || applicationStatus.type === 'already-applied'}
                >
                  {applicationStatus.type === 'loading' || isApplying ? (
                    <>
                      <div className={styles.loadingSpinner}></div>
                      {isApplying ? 'Envoi en cours...' : 'Chargement...'}
                    </>
                  ) : applicationStatus.canApply ? (
                    <>
                      <Image src="/mail.svg" alt="" width={20} height={20} />
                      Envoyer ma candidature
                    </>
                  ) : applicationStatus.type === 'already-applied' ? (
                    <>
                      <Image src="/Vector.svg" alt="" width={20} height={20} />
                      Candidature envoyée
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

                {applicationStatus.canApply && (
                  <p className={styles.applicationNote}>
                    <Image src="/material_symbols_settings.svg" alt="" width={14} height={14} />
                    Vos informations seront partagées avec le mentor
                  </p>
                )}
              </div>

              {/* Notification Messages */}
              {applicationMessage && (
                <div className={`${styles.notificationMessage} ${styles[applicationMessage.type]}`}>
                  <div className={styles.notificationIcon}>
                    <Image 
                      src={applicationMessage.type === 'success' ? '/Vector.svg' : '/material_symbols_settings.svg'} 
                      alt={applicationMessage.type} 
                      width={20} 
                      height={20} 
                    />
                  </div>
                  <div className={styles.notificationContent}>
                    <p>{applicationMessage.text}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnnonceDetail;