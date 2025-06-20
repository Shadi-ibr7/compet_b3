"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from "@/styles/JobSection.module.css";

const annonces = [
  {
    image: "/image.png",
    nom: "Harry's Bar",
    titre: "Bar Parisien",
    description: "Situé au cœur de Paris, un lieu incontournable pour les amateurs de cocktails.",
    temps: "Temps complet",
    localisation: "Paris, France",
  },
  {
    image: "/image.png",
    nom: "Le XVIII",
    titre: "Fleuriste",
    description: "Nous créons de beaux arrangements floraux faits main avec des fleurs locales et amour.",
    temps: "Temps complet",
    localisation: "Fontainebleau, France",
  },
  {
    image: "/image.png",
    nom: "La Mie de Quartier",
    titre: "Boulanger",
    description: "On pétrit chaque jour du bon pain, fait maison, avec des farines locales et beaucoup d'amour.",
    temps: "Temps complet",
    localisation: "Fontainebleau, France",
  },
  {
    image: "/image.png",
    nom: "Harry's Bar",
    titre: "Bar Parisien",
    description: "Situé au cœur de Paris, un lieu incontournable pour les amateurs de cocktails.",
    temps: "Temps complet",
    localisation: "Paris, France",
  },
];

const JobSection = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderCard = (annonce: typeof annonces[0], i: number) => (
    <div className={styles.jobCard} key={i}>
      <div className={styles.cardImageWrapper}>
        <Image className={styles.cardImage} layout="fill" objectFit="cover" alt={`Image pour ${annonce.nom}`} src={annonce.image} />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{annonce.nom}</div>
        <div className={styles.cardJob}>{annonce.titre}</div>
        <div className={styles.cardDesc}><span className={styles.cardDescLabel}>Description :</span> {annonce.description}</div>
        <div className={styles.cardInfos}>
          <div className={styles.cardInfo}><Image className={styles.groupIcon} width={16} height={16} alt="" src="/Group.svg" /> {annonce.temps}</div>
          <div className={styles.cardInfo}><Image className={styles.unionIcon} width={13} height={16} alt="" src="/Union.svg" /> {annonce.localisation}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section className={styles.jobSectionBg}>
      <div className={styles.sectionTitleWrapper}>
        <span className={styles.lesAnnoncesQuiFontTournerChild}></span>
        <h2 className={styles.lesAnnoncesQui}>
          Les annonces qui font tourner <span className={styles.accent}>la vie locale.</span>
        </h2>
      </div>

      {isDesktop ? (
        <div className={styles.cardsGrid}>
          {annonces.map((annonce, i) => renderCard(annonce, i))}
        </div>
      ) : (
        <Swiper
          spaceBetween={16}
          slidesPerView={'auto'}
          className={styles.swiperContainer}
        >
          {annonces.map((annonce, i) => (
            <SwiperSlide key={i} className={styles.swiperSlide}>
              {renderCard(annonce, i)}
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className={styles.ctaWrapper}>
        <button className={styles.ctaBtn}>Découvrir les annonces</button>
      </div>
    </section>
  );
};

export default JobSection; 