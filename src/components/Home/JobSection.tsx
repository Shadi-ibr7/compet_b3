"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import styles from "@/styles/JobSection.module.css";

const jobs = [
  {
    id: 1,
    image: "/image.png",
    title: "La Mie de Quartier",
    job: "Boulanger",
    desc: "On pétrit chaque jour du bon pain, fait maison, avec des farines locales et beaucoup d'amour.",
    type: "Temps complet",
    location: "Fontainebleau, France"
  },
  {
    id: 2,
    image: "/image.png",
    title: "Le XVIII",
    job: "Fleuriste",
    desc: "Nous créons de beaux arrangements floraux faits main avec des fleurs locales et amour.",
    type: "Temps complet",
    location: "Fontainebleau, France"
  },
  {
    id: 3,
    image: "/image.png",
    title: "Harry's Bar",
    job: "Bar Parisien",
    desc: "Situé au cœur de Paris, un lieu incontournable pour les amateurs de cocktails.",
    type: "Temps complet",
    location: "Paris, France"
  }
];

const JobSection = () => {
  return (
    <div className={styles.frameParent}>
      <div className={styles.lesAnnoncesQuiFontTournerParent}>
        <div className={styles.lesAnnoncesQuiFontTourner}>
          <div className={styles.lesAnnoncesQuiFontTournerChild}></div>
          <b className={styles.lesAnnoncesQui}>
            Les annonces qui font tourner <span className={styles.accent}>la vie locale.</span>
          </b>
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
              <div className={styles.jobCard}>
                <div className={styles.cardImageWrapper}>
                  <Image className={styles.cardImage} width={263} height={173} alt={job.title} src={job.image} />
                  <div className={styles.ellipseParent}>
                    <div className={styles.groupChild}></div>
                    <Image className={styles.mdiarrowUpIcon} width={50} height={50} alt="Voir plus" src="/mdi-arrow-up.svg" />
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <button className={styles.bookmarkMobile} aria-label="Ajouter aux favoris">
                    <Image className={styles.vectorIcon} width={20} height={26} alt="Bookmark" src="/BookmarkMobile.svg" />
                  </button>
                  <div className={styles.cardTitle}>{job.title}</div>
                  <div className={styles.cardJob}>{job.job}</div>
                  <div className={styles.cardDesc}><span className={styles.cardDescLabel}>Description :</span> {job.desc}</div>
                  <div className={styles.cardInfos}>
                    <div className={styles.cardInfo}><Image className={styles.groupIcon} width={16} height={16} alt="Temps complet" src="/Group.svg" /> {job.type}</div>
                    <div className={styles.cardInfo}><Image className={styles.unionIcon} width={13} height={16} alt="Localisation" src="/Union.svg" /> {job.location}</div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={styles.dcouvrirLesAnnoncesWrapper}>
          <a href="/annonces" style={{ color: 'inherit', textDecoration: 'none' }}>
          <b>Découvrir les annonces</b>
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobSection; 