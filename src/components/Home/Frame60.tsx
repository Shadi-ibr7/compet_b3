"use client";

import React, { useState, useEffect } from "react";
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from "@/styles/Frame60.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import type { IArticle } from "@/types/interfaces/article.interface";

const Card = ({ article }: { article: IArticle }) => (
  <Link href={`/blog/${article.id}`} className={styles.card}>
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
  </Link>
);

const Frame60: NextPage = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1200);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des articles');
        }
        
        const data = await response.json();
        // Prendre les 4 premiers articles pour la homepage
        setArticles(data.slice(0, 4));
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const showGrid = isDesktop && articles.length <= 4;

  return (
    <section className={styles.section}>
      <div className={styles.headerBlock}>
        <h2 className={styles.title}>
          Le coin des idées, des conseils et <span className={styles.highlight}>des retours d&apos;expérience.</span>
        </h2>
      </div>
      
      {loading ? (
        <div className={styles.loading}>Chargement des articles...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : articles.length === 0 ? (
        <div className={styles.noArticles}>Aucun article disponible pour le moment</div>
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