"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from "@/styles/JobSection.module.css";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";



const JobSection = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [annonces, setAnnonces] = useState<IAnnonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/annonces');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des annonces');
        }
        
        const data = await response.json();
        // Prendre les 4 premières annonces pour la homepage
        setAnnonces(data.slice(0, 4));
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les annonces');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  const renderCard = (annonce: IAnnonce, i: number) => (
    <Link href={`/annonces/${annonce.id}`} className={styles.jobCard} key={i}>
      <div className={styles.cardImageWrapper}>
        <Image 
          className={styles.cardImage} 
          fill
          style={{ objectFit: 'cover' }}
          alt={`Image pour ${annonce.nomEtablissement}`} 
          src={annonce.imageUrl || '/image.png'} 
        />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{annonce.nomEtablissement}</div>
        <div className={styles.cardJob}>{annonce.nomMetier}</div>
        <div className={styles.cardDesc}><span className={styles.cardDescLabel}>Description :</span> {annonce.description}</div>
        <div className={styles.cardInfos}>
          <div className={styles.cardInfo}><Image className={styles.groupIcon} width={16} height={16} alt="" src="/Group.svg" /> {annonce.type}</div>
          <div className={styles.cardInfo}><Image className={styles.unionIcon} width={13} height={16} alt="" src="/Union.svg" /> {annonce.localisation}</div>
        </div>
      </div>
    </Link>
  );

  return (
    <section className={styles.jobSectionBg}>
      <div className={styles.sectionTitleWrapper}>
        <span className={styles.lesAnnoncesQuiFontTournerChild}></span>
        <h2 className={styles.lesAnnoncesQui}>
          Les annonces qui font tourner <span className={styles.accent}>la vie locale.</span>
        </h2>
      </div>

      {loading ? (
        <div className={styles.loading}>Chargement des annonces...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : annonces.length === 0 ? (
        <div className={styles.noAnnonces}>Aucune annonce disponible pour le moment</div>
      ) : isDesktop ? (
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
        <Link href="/annonces" className={styles.ctaBtn}>Découvrir les annonces</Link>
      </div>
    </section>
  );
};

export default JobSection; 