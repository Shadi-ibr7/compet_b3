'use client';
import React, { useState } from "react";
import Image from "next/image";
import styles from "./AnnoncesSection.module.css";
import JobCard, { Job } from "./JobCard";

const AnnoncesSection = () => {
  const [search, setSearch] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [showSector, setShowSector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const jobs: Job[] = [
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

  const PasPlusDannoncesIci = () => (
    <b className={styles.pasPlusDannonces}>Pas plus d'annonces ici !</b>
  );

  const Frame68 = () => (
    <div className={styles.groupParent}>
      <div className={styles.etSiAuLieuDeChercherUnTParent}>
        <div className={styles.etSiAuContainer}>
          <span className={styles.etSiAu}>{`Et si au lieu de chercher un travail, `}</span>
          <b>vous en créiez un ?</b>
        </div>
        <div className={styles.crerMonAvenirWrapper}>
          <b className={styles.crerMonAvenir}>Créer mon avenir</b>
        </div>
      </div>
    </div>
  );

  const BlocFinAnnonces = () => (
    <div className={styles.blocFinWrapper}>
      <div className={styles.noMoreAds}>Pas plus d'annonces ici !</div>
      <div className={styles.questionBlock}>
        Et si au lieu de chercher un travail,<br />
        <span className={styles.questionBold}>vous en créiez un&nbsp;?</span>
      </div>
      <button className={styles.creerAvenirBtn}>Créer mon avenir</button>
    </div>
  );

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Les annonces qui font tourner <span className={styles.highlight}>la vie locale.</span>
      </h2>
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchBar}>
          <Image src="/Icon_Recherche.svg" alt="" width={24} height={24} className={styles.iconRecherche} />
          <input
            className={styles.input}
            type="text"
            placeholder="Rechercher une annonce par domaine"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.filtersRow}>
        <button className={styles.filterBtn} onClick={() => setShowLocation(v => !v)}>
          <Image src="/Union.svg" alt="" width={13} height={16} className={styles.filterIcon} />
          <span>Localisation</span>
        </button>
        <button className={styles.filterBtn} onClick={() => setShowSector(v => !v)}>
          <Image src="/Vector2.svg" alt="" width={16} height={16} className={styles.filterIcon} />
          <span>Secteur</span>
        </button>
        <button className={styles.filterBtnDark} onClick={() => setShowFilters(v => !v)}>
          <Image src="/Vector_Stroke.svg" alt="" width={16} height={11} className={styles.filterIcon} />
          <span>Plus de filtres</span>
        </button>
      </div>
      {/* Menus logiques (exemple simple, à remplacer par vrais menus/modals si besoin) */}
      {showLocation && (
        <div className={styles.menuPopup}>Sélectionnez une localisation (exemple)</div>
      )}
      {showSector && (
        <div className={styles.menuPopup}>Sélectionnez un secteur (exemple)</div>
      )}
      {showFilters && (
        <div className={styles.menuPopup}>Filtres avancés (exemple)</div>
      )}
      <div className={styles.cardsList}>
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
        <BlocFinAnnonces />
      </div>
    </section>
  );
};

export default AnnoncesSection; 