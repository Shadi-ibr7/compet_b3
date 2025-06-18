"use client";

import React from "react";
import type { NextPage } from 'next';
import Image from 'next/image';
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
    desc: "Changer de voie professionnelle est une aventure aussi exaltante qu'angoissante. Avant même de franchir le pas, de nombreuses peurs surgissent..."
  },
  {
    id: 2,
    image: '/image.png',
    title: 'Oser se lancer : témoignages de commerçants',
    desc: 'Découvrez les parcours inspirants de ceux qui ont franchi le cap et ouvert leur commerce de proximité.'
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
  return (
    <section className={styles.section}>
      <div className={styles.headerBlock}>
        <h2 className={styles.title}>
          <span className={styles.highlight}>Le coin des idées, des conseils</span> et des <span className={styles.highlight}>retours d'expérience.</span>
        </h2>
      </div>
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
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <Card post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
      <a href="/blog" className={styles.blogBtn}>Accéder au blog</a>
    </section>
  );
};

export default Frame60; 