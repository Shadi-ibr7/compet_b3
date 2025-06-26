'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import type { IMentorRating, IRatingEligibility } from "@/types/interfaces/rating.interface";
import { getMentorRating, checkRatingEligibility } from "@/lib/ratingService";
import JobCard from "@/components/annonces/JobCard";
import RatingDisplay from "@/components/rating/RatingDisplay";
import RatingForm from "@/components/rating/RatingForm";
import styles from "./MentorDetail.module.css";

interface MentorDetailProps {
  mentor: IMentor;
  annonces: IAnnonce[];
}

const MentorDetail = ({ mentor, annonces }: MentorDetailProps) => {
  const { data: session } = useSession();
  const [mentorRating, setMentorRating] = useState<IMentorRating | null>(null);
  const [eligibility, setEligibility] = useState<IRatingEligibility | null>(null);
  const [showRatingForm, setShowRatingForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (mentor.id) {
        const rating = await getMentorRating(mentor.id);
        setMentorRating(rating);

        // Vérifier éligibilité si utilisateur connecté
        if (session?.user?.id && session.user.role === 'molt') {
          const eligible = await checkRatingEligibility(session.user.id, mentor.id);
          setEligibility(eligible);
        }
      }
    };
    fetchData();
  }, [mentor.id, session?.user?.id, session?.user?.role]);

  const handleRatingSuccess = async () => {
    setShowRatingForm(false);
    // Recharger les données
    if (mentor.id) {
      const rating = await getMentorRating(mentor.id);
      setMentorRating(rating);
      
      if (session?.user?.id) {
        const eligible = await checkRatingEligibility(session.user.id, mentor.id);
        setEligibility(eligible);
      }
    }
  };

  if (!mentor) return null;

  const altText = `Photo de ${mentor.nom || 'Mentor'}, ${mentor.job || 'Profession non renseignée'}`;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.mentorHeader}>
            <Image 
              src={mentor.linkPhoto || '/placeholder_pp.png'} 
              alt={altText} 
              width={200} 
              height={200} 
              className={styles.heroAvatar}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder_pp.png';
              }}
            />
            <div className={styles.mentorInfo}>
              <h1 className={styles.mentorName}>{mentor.nom || 'Nom non renseigné'}</h1>
              <div className={styles.mentorJob}>{mentor.job || 'Profession non renseignée'}</div>
              <div className={styles.mentorLocation}>
                <Image src="/Union.svg" alt="Localisation" width={16} height={20} /> 
                <span>{mentor.localisation || 'Localisation non renseignée'}</span>
              </div>
              <div className={styles.mentorRating}>
                <RatingDisplay 
                  averageRating={mentorRating?.averageRating || null}
                  totalRatings={mentorRating?.totalRatings || 0}
                  showText={true}
                  size="medium"
                />
              </div>
            </div>
          </div>
          
          <div className={styles.mentorDescription}>
            <h2 className={styles.sectionTitle}>À propos</h2>
            <p className={styles.description}>
              {mentor.description || 'Description non renseignée'}
            </p>
          </div>

          {/* Section Notation */}
          <div className={styles.ratingSection}>
            <h2 className={styles.sectionTitle}>Avis et notes</h2>
            
            {mentorRating && mentorRating.totalRatings > 0 ? (
              <div className={styles.ratingsOverview}>
                <div className={styles.ratingsSummary}>
                  <RatingDisplay 
                    averageRating={mentorRating.averageRating}
                    totalRatings={mentorRating.totalRatings}
                    showText={true}
                    size="large"
                  />
                </div>
                
                {mentorRating.ratings.slice(0, 3).map((rating) => (
                  <div key={rating.id} className={styles.ratingItem}>
                    <div className={styles.ratingHeader}>
                      <RatingDisplay 
                        averageRating={rating.rating}
                        totalRatings={1}
                        showText={false}
                        size="small"
                      />
                      <span className={styles.ratingDate}>
                        {new Date(rating.dateCreated).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className={styles.ratingComment}>{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noRatings}>Ce mentor n'a pas encore reçu d'avis.</p>
            )}

            {/* Bouton/Formulaire de notation */}
            {eligibility?.canRate && !showRatingForm && (
              <button 
                onClick={() => setShowRatingForm(true)}
                className={styles.rateButton}
              >
                Noter ce mentor
              </button>
            )}

            {eligibility?.hasAlreadyRated && (
              <p className={styles.alreadyRated}>
                Vous avez déjà noté ce mentor
              </p>
            )}

            {!eligibility?.canRate && !eligibility?.hasAlreadyRated && eligibility?.reason && (
              <p className={styles.cannotRate}>
                {eligibility.reason}
              </p>
            )}

            {showRatingForm && (
              <RatingForm 
                mentorId={mentor.id!}
                mentorName={mentor.nom}
                onSuccess={handleRatingSuccess}
                onCancel={() => setShowRatingForm(false)}
              />
            )}
          </div>

        </div>
      </section>

      {/* Annonces Section */}
      <section className={styles.annoncesSection}>
        <div className={styles.annoncesContent}>
          <h2 className={styles.sectionTitle}>
            {annonces.length > 0 ? 'Opportunité proposée' : 'Disponibilité'}
          </h2>
          
          {annonces.length > 0 ? (
            <div className={styles.availableAnnonces}>
              <div className={styles.availableIcon}>
                <Image src="/Vector.svg" alt="Disponible" width={48} height={48} />
              </div>
              <h3 className={styles.availableTitle}>Ce mentor propose une opportunité</h3>
              <p className={styles.availableText}>
                {mentor.nom} a actuellement une mission disponible :
              </p>
              <div className={styles.annoncesList}>
                {annonces.map((annonce) => (
                  <div key={annonce.id} className={styles.annonceItem}>
                    <h4 className={styles.annonceTitle}>{annonce.nomMetier}</h4>
                    <p className={styles.annonceCompany}>{annonce.nomEtablissement}</p>
                    <p className={styles.annonceLocation}>
                      <Image src="/Union.svg" alt="Localisation" width={12} height={14} />
                      {annonce.localisation}
                    </p>
                  </div>
                ))}
              </div>
              <div className={styles.contactPrompt}>
                <p>Intéressé par cette opportunité ?</p>
                <span className={styles.contactHighlight}>Contactez directement le mentor !</span>
              </div>
            </div>
          ) : (
            <div className={styles.noAnnonces}>
              <div className={styles.noAnnoncesIcon}>
                <Image src="/material_symbols_settings.svg" alt="Paramètres" width={48} height={48} />
              </div>
              <h3 className={styles.noAnnoncesTitle}>Ce mentor n'est pas disponible pour le moment</h3>
              <p className={styles.noAnnoncesText}>
                {mentor.nom} ne propose actuellement aucune opportunité. 
                Vous pouvez le contacter directement pour discuter de vos besoins.
              </p>
              <Link href="/mentors" className={styles.backToMentors}>
                Découvrir d'autres mentors
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Navigation */}
      <section className={styles.navigationSection}>
        <Link href="/mentors" className={styles.backButton}>
          <Image src="/mdi-arrow-up.svg" alt="Retour" width={20} height={20} />
          Retour aux mentors
        </Link>
      </section>
    </div>
  );
};

export default MentorDetail;