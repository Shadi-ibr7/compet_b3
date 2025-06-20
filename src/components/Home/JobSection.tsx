"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "@/styles/JobSection.module.css";

interface Job {
  image: string;
  title: string;
  job: string;
  description: string;
  time: string;
  location: string;
}

const jobData: Job[] = [
  {
    image: "/image.png",
    title: "La Mie de Quartier",
    job: "Boulanger",
    description: "On pétrit chaque jour du bon pain, fait maison, avec des farines locales et beaucoup d'amour.",
    time: "Temps complet",
    location: "Fontainebleau, France",
  },
  {
    image: "/image.png",
    title: "Le XVIII",
    job: "Fleuriste",
    description: "Nous créons de beaux arrangements floraux faits main avec des fleurs locales et amour.",
    time: "Temps complet",
    location: "Fontainebleau, France",
  },
  {
    image: "/image.png",
    title: "Harry's Bar",
    job: "Bar Parisien",
    description: "Situé au coeur de Paris, un lieu incontournable pour les amateurs de cocktails.",
    time: "Temps complet",
    location: "Paris, France",
  },
  // You can add a 4th card here if needed for the grid layout on desktop
];

const JobCard = ({ jobInfo }: { jobInfo: Job }) => {
  return (
    <div className={styles.jobCard}>
      <div className={styles.cardImageWrapper}>
        <Image src={jobInfo.image} alt={jobInfo.job} layout="fill" className={styles.cardImage} />
      </div>

      <div className={styles.cardContent}>
        <p className={styles.cardTitle}>{jobInfo.title}</p>
        <h3 className={styles.cardJob}>{jobInfo.job}</h3>
        <p className={styles.cardDesc}>
          <strong>Description :</strong> {jobInfo.description}
        </p>
        <div className={styles.cardInfos}>
          <div className={styles.cardInfo}>
            <div className={styles.infoDot}></div>
            <span>{jobInfo.time}</span>
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.infoDot}></div>
            <span>{jobInfo.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.jobSectionBg}>
      <div className={styles.jobSectionContainer}>
        <div className={styles.sectionTitleWrapper}>
          <h2 className={styles.lesAnnoncesQui}>
            Les annonces qui font tourner la vie locale.
          </h2>
          <div className={styles.lesAnnoncesQuiFontTournerChild}></div>
        </div>

        <div className={styles.cardsScroller}>
          {jobData.map((job, index) => (
            <JobCard key={index} jobInfo={job} />
          ))}
        </div>

        <div className={styles.paginationDots}>
          {jobData.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(index)}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobSection; 