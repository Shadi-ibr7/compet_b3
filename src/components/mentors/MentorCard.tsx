'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import type { IMentorRating } from "@/types/interfaces/rating.interface";
import { getMentorRating } from "@/lib/ratingService";
import RatingDisplay from "@/components/rating/RatingDisplay";
import styles from "./MentorCard.module.css";

interface MentorCardProps {
  mentor: IMentor;
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  const [mentorRating, setMentorRating] = useState<IMentorRating | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      if (mentor.id) {
        const rating = await getMentorRating(mentor.id);
        setMentorRating(rating);
      }
    };
    fetchRating();
  }, [mentor.id]);

  if (!mentor) return null;

  // Créer un alt text descriptif pour l'accessibilité
  const altText = `Photo de ${mentor.nom || 'Mentor'}, ${mentor.job || 'Profession non renseignée'}`;

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
            <RatingDisplay 
              averageRating={mentorRating?.averageRating || null}
              totalRatings={mentorRating?.totalRatings || 0}
              showText={true}
              size="small"
            />
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