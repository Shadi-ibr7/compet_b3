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
import type { IArticle } from '@/types/interfaces/article.interface';

// Données de fallback en cas d'erreur API
const fallbackPosts = [
  {
    id: '1',
    title: '5 peurs courantes avant une reconversion et comment les dépasser',
    meta: { description: "Changer de voie professionnelle est une aventure aussi exaltante qu'angoissante. Avant même de franchir le pas, de nombreuses peurs surgissent..." },
    imageUrl: '/image.png'
  },
  {
    id: '2',
    title: 'Oser se lancer : témoignages de commerçants',
    meta: { description: 'Découvrez les parcours inspirants de ceux qui ont franchi le cap et ouvert leur commerce de proximité.' },
    imageUrl: '/image.png'
  },
  {
    id: '3',
    title: 'Comment bien choisir son local commercial ?',
    meta: { description: 'Les critères essentiels pour sélectionner le bon emplacement et réussir son installation.' },
    imageUrl: '/image.png'
  },
  {
    id: '4',
    title: 'Trouver ses premiers clients : conseils pratiques',
    meta: { description: "Des astuces concrètes pour attirer et fidéliser une clientèle locale dès l'ouverture." },
    imageUrl: '/image.png'
  },
];

const Card = ({ article }: { article: IArticle }) => (
  <Link href={`/blog/${article.id}`} className={styles.cardLink}>
    <article className={styles.card}>
      <Image 
        src={article.imageUrl || '/image.png'} 
        alt={article.title} 
        width={263} 
        height={173} 
        className={styles.cardImage} 
      />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{article.title}</h3>
        <p className={styles.cardDesc}>{article.meta.description}</p>
      </div>
    </article>
  </Link>
);

const Frame60: NextPage = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch articles depuis l'API
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des articles');
      }
      
      const data = await response.json();
      // Limiter à 4 articles pour la homepage et trier par date
      const sortedArticles = data
        .sort((a: IArticle, b: IArticle) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);
      
      setArticles(sortedArticles);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les articles');
      // Utiliser les données de fallback en cas d'erreur
      setArticles(fallbackPosts as IArticle[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

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

  const showGrid = isDesktop && articles.length <= 4;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.headerBlock}>
        <h2 className={styles.title}>
          Le coin des idées, des conseils et <span className={styles.highlight}>des retours d&apos;expérience.</span>
        </h2>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des articles...</p>
        </div>
      ) : error && articles.length === 0 ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Impossible de charger les articles</p>
          <button onClick={fetchArticles} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p className={styles.emptyMessage}>Aucun article disponible pour le moment</p>
        </div>
      ) : showGrid ? (
        <div className={styles.cardsScroller}>
          {articles.map((article) => (
            <Card key={article.id} article={article} />
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
          {articles.map((article) => (
            <SwiperSlide key={article.id}>
              <Card article={article} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      
      <Link href="/blog" className={styles.blogBtn}>Accéder au blog</Link>
    </section>
  );
};

export default Frame60; 