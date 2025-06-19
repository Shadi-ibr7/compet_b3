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
      <Image className={styles.cardImage} width={263} height={173} alt={job.title} src={job.image} />
    </div>
    <div className={styles.cardContent}>
      <div className={styles.cardTitle}>{job.title}</div>
      <div className={styles.boulanger}>{job.job}</div>
      <div className={styles.cardDesc}><span className={styles.description}>Description :</span> {job.desc}</div>
      <div className={styles.cardInfos}>
        <div className={styles.cardInfo}><Image className={styles.groupIcon} width={16} height={16} alt="Temps complet" src="/Group.svg" /> {job.type}</div>
        <div className={styles.cardInfo}><Image className={styles.unionIcon} width={13} height={16} alt="Localisation" src="/Union.svg" /> {job.location}</div>
      </div>
      <div className={styles.postulerWrapper}>
        <span className={styles.postuler}>Postuler</span>
      </div>
    </div>
  </div>
);

export default JobCard; 