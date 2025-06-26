"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/styles/HeroSection.module.css";

const HeroSection = () => {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                router.push(`/annonces?search=${encodeURIComponent(searchTerm.trim())}`);
              }
            }}
          />
        </div>

        <button 
          className={styles.trouverMonMentor}
          onClick={() => {
            if (searchTerm.trim()) {
              router.push(`/annonces?search=${encodeURIComponent(searchTerm.trim())}`);
            } else {
              router.push('/annonces');
            }
          }}
        >
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