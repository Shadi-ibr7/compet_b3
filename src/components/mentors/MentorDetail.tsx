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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (mentor.id) {
          const rating = await getMentorRating(mentor.id);
          setMentorRating(rating);

          // Vérifier éligibilité si utilisateur connecté
          if (session?.user?.id && session.user.role === 'molt') {
            const eligible = await checkRatingEligibility(session.user.id, mentor.id);
            setEligibility(eligible);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setIsLoading(false);
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
  const hasOpportunities = annonces.length > 0;
  const totalRatings = mentorRating?.totalRatings || 0;
  const averageRating = mentorRating?.averageRating || null;

  return (
    <div className={styles.container}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumbNav} aria-label="Navigation">
        <div className={styles.breadcrumbContent}>
          <Link href="/mentors" className={styles.breadcrumbLink}>
            <Image src="/mdi-arrow-up.svg" alt="" width={16} height={16} />
            Mentors
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{mentor.nom || 'Mentor'}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* Profile Header */}
          <div className={styles.mentorHeader}>
            <div className={styles.avatarContainer}>
              <Image 
                src={mentor.linkPhoto || '/placeholder_pp.png'} 
                alt={altText} 
                width={200} 
                height={200} 
                className={styles.heroAvatar}
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder_pp.png';
                }}
              />
              {hasOpportunities && (
                <div className={styles.availabilityBadge}>
                  <span className={styles.availabilityDot}></span>
                  Disponible
                </div>
              )}
            </div>
            
            <div className={styles.mentorInfo}>
              <div className={styles.mentorNameSection}>
                <h1 className={styles.mentorName}>{mentor.nom || 'Nom non renseigné'}</h1>
                <div className={styles.mentorJob}>
                  <Image src="/briefcase.svg" alt="" width={16} height={16} />
                  {mentor.job || 'Profession non renseignée'}
                </div>
              </div>
              
              <div className={styles.mentorMeta}>
                <div className={styles.locationInfo}>
                  <Image src="/Union.svg" alt="Localisation" width={16} height={20} /> 
                  <span>{mentor.localisation || 'Localisation non renseignée'}</span>
                </div>
                
                <div className={styles.ratingInfo}>
                  <RatingDisplay 
                    averageRating={averageRating}
                    totalRatings={totalRatings}
                    showText={true}
                    size="medium"
                  />
                  {totalRatings > 0 && (
                    <span className={styles.ratingSubtext}>
                      Basé sur {totalRatings} avis
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className={styles.quickStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{totalRatings}</span>
                  <span className={styles.statLabel}>Avis reçus</span>
                </div>
                <div className={styles.statSeparator}></div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{hasOpportunities ? annonces.length : 0}</span>
                  <span className={styles.statLabel}>Opportunité{annonces.length > 1 ? 's' : ''}</span>
                </div>
                <div className={styles.statSeparator}></div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>
                    {averageRating ? averageRating.toFixed(1) : '--'}
                  </span>
                  <span className={styles.statLabel}>Note moyenne</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description Section */}
          <div className={styles.mentorDescription}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>À propos de ce mentor</h2>
              <div className={styles.sectionDivider}></div>
            </div>
            <div className={styles.descriptionContent}>
              <p className={styles.description}>
                {mentor.description || 'Ce mentor n\'a pas encore fourni de description détaillée de son profil et de son expertise.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className={styles.mainContent}>
        <div className={styles.contentGrid}>
          
          {/* Left Column - Opportunities */}
          <div className={styles.leftColumn}>
            <div className={styles.opportunitiesSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {hasOpportunities ? 'Opportunités disponibles' : 'Statut de disponibilité'}
                </h2>
                <div className={styles.sectionDivider}></div>
              </div>
              
              {hasOpportunities ? (
                <div className={styles.opportunitiesList}>
                  <div className={styles.statusCard}>
                    <div className={styles.statusHeader}>
                      <div className={styles.statusIcon}>
                        <Image src="/Vector.svg" alt="" width={24} height={24} />
                      </div>
                      <div className={styles.statusInfo}>
                        <h3 className={styles.statusTitle}>Mentor disponible</h3>
                        <p className={styles.statusDescription}>
                          Ce mentor propose actuellement {annonces.length} opportunité{annonces.length > 1 ? 's' : ''} de mentorat
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.opportunityCards}>
                    {annonces.map((annonce) => (
                      <div key={annonce.id} className={styles.opportunityCard}>
                        <div className={styles.cardHeader}>
                          <h4 className={styles.opportunityTitle}>{annonce.nomMetier}</h4>
                          <span className={styles.opportunityType}>Mission</span>
                        </div>
                        <div className={styles.cardBody}>
                          <div className={styles.companyInfo}>
                            <Image src="/Group1.svg" alt="" width={16} height={16} />
                            <span>{annonce.nomEtablissement}</span>
                          </div>
                          <div className={styles.locationInfo}>
                            <Image src="/Union.svg" alt="" width={14} height={16} />
                            <span>{annonce.localisation}</span>
                          </div>
                        </div>
                        <div className={styles.cardFooter}>
                          <Link 
                            href={`/annonces/${annonce.id}`}
                            className={styles.viewOpportunityBtn}
                          >
                            Voir les détails
                            <Image src="/arrow-left.svg" alt="" width={16} height={16} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.contactPrompt}>
                    <div className={styles.contactHeader}>
                      <Image src="/mail.svg" alt="" width={24} height={24} />
                      <h3>Intéressé par ces opportunités ?</h3>
                    </div>
                    <p>Contactez directement ce mentor pour discuter des détails et postuler.</p>
                    <button className={styles.contactButton}>
                      Contacter le mentor
                      <Image src="/mail.svg" alt="" width={16} height={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.noOpportunities}>
                  <div className={styles.statusCard}>
                    <div className={styles.statusHeader}>
                      <div className={styles.statusIconUnavailable}>
                        <Image src="/material_symbols_settings.svg" alt="" width={24} height={24} />
                      </div>
                      <div className={styles.statusInfo}>
                        <h3 className={styles.statusTitle}>Mentor non disponible</h3>
                        <p className={styles.statusDescription}>
                          Ce mentor ne propose actuellement aucune opportunité de mentorat
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.alternativeActions}>
                    <p>Vous pouvez toujours contacter ce mentor pour des opportunités futures ou</p>
                    <Link href="/mentors" className={styles.exploreOthers}>
                      <Image src="/Vector.svg" alt="" width={16} height={16} />
                      Découvrir d'autres mentors
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Reviews & Rating */}
          <div className={styles.rightColumn}>
            <div className={styles.ratingSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Avis et évaluations</h2>
                <div className={styles.sectionDivider}></div>
              </div>
              
              {isLoading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Chargement des avis...</p>
                </div>
              ) : (
                <>
                  {totalRatings > 0 ? (
                    <div className={styles.ratingsContent}>
                      {/* Rating Summary */}
                      <div className={styles.ratingsSummary}>
                        <div className={styles.overallRating}>
                          <span className={styles.ratingScore}>
                            {averageRating?.toFixed(1) || '--'}
                          </span>
                          <div className={styles.ratingDetails}>
                            <RatingDisplay 
                              averageRating={averageRating}
                              totalRatings={totalRatings}
                              showText={false}
                              size="large"
                            />
                            <span className={styles.totalReviews}>
                              {totalRatings} avis
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent Reviews */}
                      <div className={styles.recentReviews}>
                        <h3 className={styles.reviewsTitle}>Avis récents</h3>
                        <div className={styles.reviewsList}>
                          {mentorRating?.ratings.slice(0, 3).map((rating) => (
                            <div key={rating.id} className={styles.reviewItem}>
                              <div className={styles.reviewHeader}>
                                <RatingDisplay 
                                  averageRating={rating.rating}
                                  totalRatings={1}
                                  showText={false}
                                  size="small"
                                />
                                <span className={styles.reviewDate}>
                                  {new Date(rating.dateCreated).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              {rating.comment && (
                                <p className={styles.reviewComment}>"{rating.comment}"</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noRatings}>
                      <div className={styles.noRatingsIcon}>
                        <Image src="/Vector.svg" alt="" width={32} height={32} />
                      </div>
                      <h3>Aucun avis pour le moment</h3>
                      <p>Ce mentor n'a pas encore reçu d'évaluation de la part de la communauté.</p>
                    </div>
                  )}

                  {/* Rating Action */}
                  <div className={styles.ratingAction}>
                    {eligibility?.canRate && !showRatingForm && (
                      <button 
                        onClick={() => setShowRatingForm(true)}
                        className={styles.rateButton}
                      >
                        <Image src="/Vector.svg" alt="" width={16} height={16} />
                        Évaluer ce mentor
                      </button>
                    )}

                    {eligibility?.hasAlreadyRated && (
                      <div className={styles.alreadyRated}>
                        <Image src="/Vector.svg" alt="" width={16} height={16} />
                        <span>Vous avez déjà évalué ce mentor</span>
                      </div>
                    )}

                    {!eligibility?.canRate && !eligibility?.hasAlreadyRated && eligibility?.reason && (
                      <div className={styles.cannotRate}>
                        <Image src="/material_symbols_settings.svg" alt="" width={16} height={16} />
                        <span>{eligibility.reason}</span>
                      </div>
                    )}

                    {showRatingForm && (
                      <div className={styles.ratingFormContainer}>
                        <RatingForm 
                          mentorId={mentor.id!}
                          mentorName={mentor.nom}
                          onSuccess={handleRatingSuccess}
                          onCancel={() => setShowRatingForm(false)}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorDetail;