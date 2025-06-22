'use client';

import React, { useState, useEffect } from "react";
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from "@/styles/Frame59.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import type { IMentor } from "@/types/interfaces/mentor.interface";



const Card = ({ mentor }: { mentor: IMentor }) => (
  <Link href={`/mentors/${mentor.id}`} className={styles.card}>
    <div className={styles.cardHeader}>
      <Image 
        src={mentor.linkPhoto || '/image2.png'} 
        alt={mentor.nom || mentor.name || ''} 
        width={104} 
        height={104} 
        className={styles.avatar}
      />
      <div className={styles.cardInfo}>
        <h3 className={styles.name}>{mentor.nom || mentor.name}</h3>
        <div className={styles.subtitle}>{mentor.job || 'Mentor'}</div>
        <div className={styles.location}>
          <Image src="/Union.svg" alt="" width={13} height={16} /> 
          <span>{mentor.localisation || 'France'}</span>
        </div>
        <div className={styles.stars}>{'★'.repeat(Math.floor(mentor.note || 0))}{'☆'.repeat(5 - Math.floor(mentor.note || 0))}</div>
      </div>
    </div>
    <div className={styles.description}>
      <b>Description :</b> {mentor.description || 'Ce mentor n\'a pas encore ajouté de description.'}
    </div>
    <div className={styles.cta}>Voir le profil</div>
  </Link>
);

const Frame59: NextPage = () => {
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setMentors(data.slice(0, 5));
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>
          Les postes qui font tourner <span className={styles.highlight}>la vie locale.</span>
        </h2>
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Chargement des mentors...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : mentors.length === 0 ? (
          <div className={styles.noMentors}>Aucun mentor disponible pour le moment</div>
        ) : (
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
        )}
        <Link href="/mentors" className={styles.mentorsCta}>
          Découvrir nos mentors
        </Link>
      </div>
    </section>
  );
};

export default Frame59; 