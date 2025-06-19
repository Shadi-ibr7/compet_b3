import React from "react";
import Image from "next/image";
import styles from "./AnnoncesSection.module.css";

export type Job = {
  id: number;
  image: string;
  title: string;
  job: string;
  desc: string;
  type: string;
  location: string;
};

const JobCard = ({ job }: { job: Job }) => (
  <div className={styles.rectangleParent}>
    <div className={styles.cardImageWrapper}>
      <Image className={styles.cardImage} width={370} height={173} alt={job.title} src={job.image} />
    </div>
    <div className={styles.cardContent}>
      <div className={styles.cardTitle}>{job.title}</div>
      <div className={styles.cardJob}>{job.job}</div>
      <div className={styles.cardDesc}><span className={styles.cardDescLabel}>Description :</span> {job.desc}</div>
      <div className={styles.cardInfos}>
        <div className={styles.cardInfo}><Image className={styles.groupIcon} width={16} height={16} alt="Temps complet" src="/Group.svg" /> <span className={styles.cardInfoText}>{job.type}</span></div>
        <div className={styles.cardInfo}><Image className={styles.unionIcon} width={13} height={16} alt="Localisation" src="/Union.svg" /> <span className={styles.cardInfoText}>{job.location}</span></div>
        <button className={styles.bookmarkBtn} aria-label="Ajouter aux favoris">
        <Image src="/BookmarkMobile.svg" alt="Bookmark" width={24} height={24} />
        </button>
      </div>
      <button className={styles.cardButton}>Postuler</button>
    </div>
  </div>
);

export default JobCard; 