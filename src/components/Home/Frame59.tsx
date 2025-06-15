'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import styles from "@/styles/Frame59.module.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const jobs = [
  {
    id: 1,
    name: 'Mathieu Fournel',
    subtitle: 'Boulangerie artisanale',
    location: 'Troyes, France',
    image: '/image2.png',
    description: "On pétrit chaque jour du bon pain, fait maison, avec des farines locales et beaucoup d'amour. Baguettes croustillantes, pains spéciaux, viennoiseries dorées…",
    stars: 4.5,
    cta: 'Voir le profil',
  },
  {
    id: 2,
    name: 'Sophie Martin',
    subtitle: 'Épicerie fine',
    location: 'Lyon, France',
    image: '/image2.png',
    description: "Produits du terroir, épices rares, accueil chaleureux et conseils personnalisés pour tous les gourmets.",
    stars: 5,
    cta: 'Voir le profil',
  },
  {
    id: 3,
    name: 'Karim Benali',
    subtitle: 'Librairie indépendante',
    location: 'Marseille, France',
    image: '/image2.png',
    description: "Un large choix de livres, des rencontres d'auteurs et un coin lecture convivial pour petits et grands.",
    stars: 4,
    cta: 'Voir le profil',
  },
  {
    id: 4,
    name: 'Julie Dupont',
    subtitle: 'Fleuriste',
    location: 'Bordeaux, France',
    image: '/image2.png',
    description: "Bouquets sur-mesure, fleurs locales et conseils pour embellir tous vos événements.",
    stars: 4.5,
    cta: 'Voir le profil',
  },
  {
    id: 5,
    name: 'Paul Lambert',
    subtitle: 'Boucherie familiale',
    location: 'Dijon, France',
    image: '/image2.png',
    description: "Viandes locales, recettes traditionnelles et conseils pour cuisiner comme un chef.",
    stars: 5,
    cta: 'Voir le profil',
  },
  {
    id: 6,
    name: 'Emma Leroy',
    subtitle: 'Café littéraire',
    location: 'Nantes, France',
    image: '/image2.png',
    description: "Un lieu cosy pour lire, échanger et déguster des pâtisseries maison.",
    stars: 4,
    cta: 'Voir le profil',
  },
  {
    id: 7,
    name: 'Lucas Petit',
    subtitle: 'Atelier vélo',
    location: 'Grenoble, France',
    image: '/image2.png',
    description: "Réparations rapides, conseils d'entretien et location de vélos pour tous.",
    stars: 4.5,
    cta: 'Voir le profil',
  },
  {
    id: 8,
    name: 'Nina Rousseau',
    subtitle: 'Fromagerie artisanale',
    location: 'Annecy, France',
    image: '/image2.png',
    description: "Sélection de fromages locaux, dégustations et conseils d'accords.",
    stars: 5,
    cta: 'Voir le profil',
  },
];

const Card = ({ job }: { job: typeof jobs[0] }) => (
  <article className={styles.card}>
    <div className={styles.cardHeader}>
      <Image src={job.image} alt={job.name} width={104} height={104} className={styles.avatar} />
      <div className={styles.cardInfo}>
        <h3 className={styles.name}>{job.name}</h3>
        <div className={styles.subtitle}>{job.subtitle}</div>
        <div className={styles.location}><Image src="/Union.svg" alt="" width={13} height={16} /> <span>{job.location}</span></div>
        <div className={styles.stars}>{'★'.repeat(Math.floor(job.stars))}{job.stars % 1 ? '☆' : ''}</div>
      </div>
    </div>
    <div className={styles.description}><b>Description :</b> {job.description}</div>
    <button className={styles.cta}>{job.cta}</button>
  </article>
);

const Frame59: NextPage = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>
          Les postes qui font tourner <span className={styles.highlight}>la vie locale.</span>
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
        {jobs.map((job) => (
          <SwiperSlide key={job.id}>
            <Card job={job} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button className={styles.mentorsCta}>Découvrir nos mentors</button>
    </section>
  );
};

export default Frame59; 