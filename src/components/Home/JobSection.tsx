"use client";
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from "@/styles/JobSection.module.css";
import type { IAnnonce } from '@/types/interfaces/annonce.interface';


const JobSection = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [annonces, setAnnonces] = useState<IAnnonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch annonces data
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/annonces');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des annonces');
        }
        const data = await response.json();
        // Limit to first 4 annonces for homepage display
        setAnnonces(data.slice(0, 4));
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des annonces:', err);
        setError('Impossible de charger les annonces');
        setAnnonces([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderCard = (annonce: IAnnonce, i: number) => (
    <Link href={`/annonces/${annonce.id}`} key={i} className={styles.jobCard}>
      <div className={styles.cardImageWrapper}>
        <Image 
          className={styles.cardImage} 
          layout="fill" 
          objectFit="cover" 
          alt={`Image pour ${annonce.nomEtablissement}`} 
          src={annonce.imageUrl || '/image.png'} 
        />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTitle}>{annonce.nomEtablissement}</div>
        <div className={styles.cardJob}>{annonce.nomMetier}</div>
        <div className={styles.cardDesc}>
          <span className={styles.cardDescLabel}>Description :</span> 
          {annonce.description.replace(/<[^>]*>/g, '').slice(0, 100)}{annonce.description.length > 100 ? '...' : ''}
        </div>
        <div className={styles.cardInfos}>
          <div className={styles.cardInfo}>
            <Image className={styles.groupIcon} width={16} height={16} alt="" src="/Group.svg" /> 
            {annonce.type}
          </div>
          <div className={styles.cardInfo}>
            <Image className={styles.unionIcon} width={13} height={16} alt="" src="/Union.svg" /> 
            {annonce.localisation}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section ref={sectionRef} className={styles.jobSectionBg}>
      <div className={styles.sectionTitleWrapper}>
        <h2 className={styles.lesAnnoncesQui}>
          Les annonces qui font tourner <span className={styles.accent}>la vie locale.</span>
        </h2>
      </div>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner}></div>
          <p>Chargement des annonces...</p>
        </div>
      ) : error ? (
        <div className={styles.errorWrapper}>
          <p>{error}</p>
        </div>
      ) : annonces.length === 0 ? (
        <div className={styles.emptyWrapper}>
          <p>Aucune annonce disponible pour le moment.</p>
        </div>
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
        <Link href="/annonces" className={styles.ctaBtn}>
          Découvrir les annonces
        </Link>
      </div>
    </section>
  );
};

export default JobSection; 