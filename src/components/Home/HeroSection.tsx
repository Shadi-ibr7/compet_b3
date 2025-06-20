import React from "react";
import Image from "next/image";
import styles from "@/styles/HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>
            <div>Parce qu&apos;un projet</div>
            <div className={styles.titleSecondLine}>
              ne se réalise
              <span className={styles.jamaisSeulBg}>
                <span className={styles.jamaisSeul}>jamais seul</span>
              </span>
            </div>
          </h1>
        </div>

        <p className={styles.mentorsInfo}>
          <strong>Plus de 300 mentors</strong> vous attendent
        </p>

        <div className={styles.searchBox}>
          <Image
            src="/Icon_Recherche.svg"
            alt=""
            width={20}
            height={20}
            className={styles.iconRecherche}
          />
          <input
            type="text"
            placeholder="Rechercher une annonce par domaine"
            className={styles.texte}
          />
        </div>

        <button className={styles.trouverMonMentor}>
          Trouver une annonce
        </button>

        <div className={styles.createJobBox}>
          <p className={styles.createJobText}>
            Et si au lieu de chercher un travail,{" "}
            <span className={styles.createJobLink}>vous en créiez un ?</span>
          </p>
          <button className={styles.crerMonAvenirWrapper}>
            Créer mon avenir
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 