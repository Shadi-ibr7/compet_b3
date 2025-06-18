import React from "react";
import Image from "next/image";
import styles from "@/styles/HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Parce qu'un projet<br />
          ne se réalise <span className={styles.jamaisSeulBg}><span className={styles.jamaisSeul}>jamais seul</span></span>
        </h1>
        <div className={styles.mentorsInfo}>
          <b>Plus de 300 mentors</b> vous attendent
        </div>
        <div className={styles.actions}>
          <div className={styles.searchBox}>
            <Image
              className={styles.iconRecherche}
              width={24}
              height={24}
              alt=""
              src="/Icon_Recherche.svg"
            />
            <div className={styles.texte}>Rechercher une annonce par domaine</div>
          </div>
          <button className={styles.trouverMonMentor}>
            <b className={styles.cta}>Trouver une annonce</b>
          </button>
          <div className={styles.groupWrapper}>
            <div className={styles.createJobBox}>
              Et si au lieu de chercher un travail, <b>vous en créiez un ?</b>
            </div>
            <button className={styles.crerMonAvenirWrapper}>
              <b className={styles.cta}>Créer mon avenir</b>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 