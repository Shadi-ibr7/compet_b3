import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import styles from "./AnnoncesSection.module.css";

// Garder l'ancienne interface pour compatibilité, mais ajouter support pour IAnnonce
export type Job = {
  id: number;
  image: string;
  title: string;
  job: string;
  desc: string;
  type: string;
  location: string;
};

interface JobCardProps {
  job?: Job;
  annonce?: IAnnonce;
}

const JobCard = ({ job, annonce }: JobCardProps) => {
  // Utiliser les données d'annonce si disponibles, sinon utiliser job (compatibilité)
  const displayData = annonce ? {
    image: annonce.imageUrl || '/placeholder_article.png',
    title: annonce.nomEtablissement,
    job: annonce.nomMetier,
    desc: annonce.description,
    type: annonce.type,
    location: annonce.localisation
  } : job;

  if (!displayData) return null;

  // Créer un alt text descriptif pour l'accessibilité
  const altText = `Annonce pour ${displayData.job} chez ${displayData.title}`;

  // Determine the link URL based on whether we have an annonce or job
  const linkUrl = annonce?.id ? `/annonces/${annonce.id}` : null;

  const cardContent = (
    <>
      <div className={styles.cardImageWrapper}>
        <Image 
          className={styles.cardImage} 
          width={370} 
          height={173} 
          alt={altText}
          src={displayData.image}
          onError={(e) => {
            // Fallback en cas d'erreur de chargement d'image
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder_article.png';
          }}
        />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{displayData.title}</div>
        <div className={styles.cardJob}>{displayData.job}</div>
        <div className={styles.cardDesc}>
          <span className={styles.cardDescLabel}>Description :</span> {displayData.desc}
        </div>
        <div className={styles.cardInfos}>
          <div className={styles.cardInfo}>
            <Image className={styles.groupIcon} width={16} height={16} alt="Type" src="/Group.svg" /> 
            <span className={styles.cardInfoText}>{displayData.type}</span>
          </div>
          <div className={styles.cardInfo}>
            <Image className={styles.unionIcon} width={13} height={16} alt="Localisation" src="/Union.svg" /> 
            <span className={styles.cardInfoText}>{displayData.location}</span>
          </div>
          <button className={styles.bookmarkBtn} aria-label="Ajouter aux favoris">
            <Image src="/BookmarkMobile.svg" alt="Bookmark" width={24} height={24} />
          </button>
        </div>
        <button className={styles.cardButton}>Postuler</button>
      </div>
    </>
  );

  return (
    <div className={styles.rectangleParent}>
      {linkUrl ? (
        <Link href={linkUrl} className={styles.cardLink}>
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </div>
  );
};

export default JobCard; 