'use client';

import React, { useEffect, useRef, useState } from "react";
import type { NextPage } from 'next';
import Image from 'next/image';
import styles from "@/styles/Frame59.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import RatingDisplay from '@/components/rating/RatingDisplay';
import { getMentorRating } from '@/lib/ratingService';
import type { IMentorRating } from '@/types/interfaces/rating.interface';
import type { IMentor } from "@/types/interfaces/mentor.interface";

// Pas de données de fallback - afficher un message quand aucun mentor n'est disponible
const fallbackMentors: IMentor[] = [];

const Card = ({ mentor }: { mentor: IMentor }) => {
  const [mentorRating, setMentorRating] = useState<IMentorRating | null>(null);
  
  useEffect(() => {
    const fetchRating = async () => {
      if (mentor.id) {
        try {
          const rating = await getMentorRating(mentor.id);
          setMentorRating(rating);
        } catch (error) {
          console.error('Erreur lors du chargement de la note:', error);
        }
      }
    };
    
    fetchRating();
  }, [mentor.id]);
  
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <Image 
          src={mentor.linkPhoto || '/image2.png'} 
          alt={mentor.nom || ''} 
          width={104} 
          height={104} 
          className={styles.avatar}
          onError={(e) => {
            // Fallback en cas d'erreur de chargement d'image
            const target = e.target as HTMLImageElement;
            target.src = '/image2.png';
          }}
        />
        <div className={styles.cardInfo}>
          <h3 className={styles.name}>{mentor.nom}</h3>
          <div className={styles.subtitle}>{mentor.job || ''}</div>
          <div className={styles.location}><Image src="/Union.svg" alt="" width={13} height={16} /> <span>{mentor.localisation}</span></div>
          <div className={styles.ratingContainer}>
            <RatingDisplay 
              averageRating={mentorRating?.averageRating || null}
              totalRatings={mentorRating?.totalRatings || 0}
              showText={true}
              size="small"
            />
          </div>
        </div>
      </div>
      <div className={styles.description}><b>Description :</b> {mentor.description || 'Ce mentor n\'a pas encore ajouté de description.'}</div>
      <button className={styles.cta} onClick={() => window.location.href = `/mentors/${mentor.id}`}>Voir le profil</button>
    </article>
  );
};

const Frame59: NextPage = () => {
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Récupérer les vrais mentors depuis l'API
    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/mentors');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des mentors');
        }
        const data = await response.json();
        // Prendre les 5 premiers mentors pour la homepage
        setMentors(data.length > 0 ? data.slice(0, 5) : fallbackMentors);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les mentors');
        setMentors(fallbackMentors);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.header}>
        <h2>
          Les postes qui font tourner <span className={styles.highlight}>la vie locale.</span>
        </h2>
      </div>
      {loading ? (
        <div className={styles.loading}>Chargement des mentors...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : mentors.length === 0 ? (
        <div className={styles.noMentors}>Aucun mentor disponible pour le moment</div>
      ) : (
        <>
          <Swiper
            className={styles.cardsScroller}
            modules={[Pagination]}
            spaceBetween={24}
            pagination={{ clickable: true }}
            centeredSlides={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              700: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
          >
            {mentors.map((mentor) => (
              <SwiperSlide key={mentor.id}>
                <Card mentor={mentor} />
              </SwiperSlide>
            ))}
          </Swiper>
          <button className={styles.mentorsCta} onClick={() => window.location.href = '/mentors'}>Découvrir nos mentors</button>
        </>
      )}
    </section>
  );
};

export default Frame59; 