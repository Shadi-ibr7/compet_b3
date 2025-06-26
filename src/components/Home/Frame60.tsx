"use client";

import React, { useState, useEffect, useRef } from "react";
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from "@/styles/Frame60.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const posts = [
  {
    id: 1,
    image: '/image.png',
    title: '5 peurs courantes avant une reconversion et comment les dépasser',
    desc: "Changer de voie professionnelle est une aventure aussi exaltante qu&apos;angoissante. Avant même de franchir le pas, de nombreuses peurs surgissent..."
  },
  {
    id: 2,
    image: '/image.png',
    title: 'Oser se lancer : témoignages de commerçants',
    desc: 'Découvrez les parcours inspirants de ceux qui ont franchi le cap et ouvert leur commerce de proximité.'
  },
  {
    id: 3,
    image: '/image.png',
    title: 'Comment bien choisir son local commercial ?',
    desc: 'Les critères essentiels pour sélectionner le bon emplacement et réussir son installation.'
  },
  {
    id: 4,
    image: '/image.png',
    title: 'Trouver ses premiers clients : conseils pratiques',
    desc: "Des astuces concrètes pour attirer et fidéliser une clientèle locale dès l'ouverture."
  },
];

const Card = ({ post }: { post: typeof posts[0] }) => (
  <article className={styles.card}>
    <Image src={post.image} alt={post.title} width={263} height={173} className={styles.cardImage} />
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>{post.title}</h3>
      <p className={styles.cardDesc}>{post.desc}</p>
    </div>
  </article>
);

const Frame60: NextPage = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1200);
    handleResize();
    window.addEventListener('resize', handleResize);
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const showGrid = isDesktop && posts.length <= 4;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.headerBlock}>
        <h2 className={styles.title}>
          Le coin des idées, des conseils et <span className={styles.highlight}>des retours d&apos;expérience.</span>
        </h2>
      </div>
      {showGrid ? (
        <div className={styles.cardsScroller}>
          {posts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
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
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
          }}
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id}>
              <Card post={post} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <Link href="/blog" className={styles.blogBtn}>Accéder au blog</Link>
    </section>
  );
};

export default Frame60; 