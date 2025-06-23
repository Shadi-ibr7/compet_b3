'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import styles from "./MentorCard.module.css";

interface MentorCardProps {
  mentor: IMentor;
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  if (!mentor) return null;

  // Créer un alt text descriptif pour l'accessibilité
  const altText = `Photo de ${mentor.nom || 'Mentor'}, ${mentor.job || 'Profession non renseignée'}`;

  // Générer les étoiles pour la note (style homepage)
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
    <article className={styles.card}>
      <Link href={`/mentors/${mentor.id}`} className={styles.cardLink}>
        <div className={styles.cardHeader}>
          <Image 
            src={mentor.linkPhoto || '/placeholder_pp.png'} 
            alt={altText} 
            width={104} 
            height={104} 
            className={styles.avatar}
            onError={(e) => {
              // Fallback en cas d'erreur de chargement d'image
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder_pp.png';
            }}
          />
          <div className={styles.cardInfo}>
            <h3 className={styles.name}>{mentor.nom || 'Nom non renseigné'}</h3>
            <div className={styles.subtitle}>{mentor.job || 'Profession non renseignée'}</div>
            <div className={styles.location}>
              <Image src="/Union.svg" alt="" width={13} height={16} /> 
              <span>{mentor.localisation || 'Localisation non renseignée'}</span>
            </div>
            {mentor.note && mentor.note > 0 && renderStars(mentor.note)}
          </div>
        </div>
        <div className={styles.description}>
          <b>Description :</b> {mentor.description || 'Description non renseignée'}
        </div>
      </Link>
      <Link href={`/mentors/${mentor.id}`} className={styles.cta}>
        Je vais voir son profil
      </Link>
    </article>
  );
};

export default MentorCard;