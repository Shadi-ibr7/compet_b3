'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import styles from "./AnnonceDetail.module.css";

interface AnnonceDetailProps {
  annonce: IAnnonce;
  mentor: IMentor | null;
}

const AnnonceDetail = ({ annonce, mentor }: AnnonceDetailProps) => {
  const { data: session, status } = useSession();

  if (!annonce) return null;

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
    if (status === 'loading') {
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

    // Check if user has paid status (assuming it's stored in session or we need to fetch it)
    // For now, we'll assume the paid status is in the user object
    // You might need to adjust this based on how the paid status is stored
    const isPaid = true; // TODO: Get this from user data
    
    if (!isPaid) {
      return { 
        canApply: false, 
        message: 'Activez votre abonnement Molt pour postuler', 
        type: 'payment',
        action: '/dashboard' // or payment page
      };
    }

    return { canApply: true, message: 'Postuler à cette offre', type: 'success' };
  };

  const applicationStatus = getApplicationStatus();

  const handleApplication = () => {
    if (applicationStatus.canApply) {
      // TODO: Implement application logic
      alert('Candidature envoyée ! (À implémenter)');
    } else if (applicationStatus.action) {
      window.location.href = applicationStatus.action;
    }
  };

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
              disabled={applicationStatus.type === 'loading'}
            >
              {applicationStatus.type === 'loading' ? (
                'Chargement...'
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
                'Activer l\'abonnement'
              ) : (
                'Continuer'
              )}
            </button>

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