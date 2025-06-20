'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import JobCard from "@/components/annonces/JobCard";
import styles from "./MentorDetail.module.css";

interface MentorDetailProps {
  mentor: IMentor;
  annonces: IAnnonce[];
}

const MentorDetail = ({ mentor, annonces }: MentorDetailProps) => {
  if (!mentor) return null;

  const altText = `Photo de ${mentor.nom || 'Mentor'}, ${mentor.job || 'Profession non renseignée'}`;

  const renderStars = (note: number = 0) => {
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 !== 0;
    
    return (
      <div className={styles.stars}>
        {'★'.repeat(fullStars)}{hasHalfStar ? '☆' : ''}
      </div>
    );
  };

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
              {mentor.note && mentor.note > 0 && (
                <div className={styles.mentorRating}>
                  {renderStars(mentor.note)}
                  <span className={styles.ratingText}>({mentor.note}/5)</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.mentorDescription}>
            <h2 className={styles.sectionTitle}>À propos</h2>
            <p className={styles.description}>
              {mentor.description || 'Description non renseignée'}
            </p>
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