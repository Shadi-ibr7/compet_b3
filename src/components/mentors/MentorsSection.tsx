'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import styles from "../annonces/AnnoncesSection.module.css";
import MentorCard from "./MentorCard";

const MentorsSection = () => {
  const [search, setSearch] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [showSector, setShowSector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // States pour les données réelles
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les mentors depuis l'API
  useEffect(() => {
    fetchMentors();
  }, []);

  // Filtrer les mentors quand la recherche change
  useEffect(() => {
    filterMentors();
  }, [search, mentors]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/mentors');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des mentors');
      }
      
      const data = await response.json();
      setMentors(data);
      setFilteredMentors(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les mentors. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    if (!search.trim()) {
      setFilteredMentors(mentors);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = mentors.filter(mentor => 
      mentor.nom?.toLowerCase().includes(searchLower) ||
      mentor.job?.toLowerCase().includes(searchLower) ||
      mentor.description?.toLowerCase().includes(searchLower) ||
      mentor.localisation?.toLowerCase().includes(searchLower)
    );
    
    setFilteredMentors(filtered);
  };

  const BlocFinMentors = () => (
    <div className={styles.blocFinWrapper}>
      <div className={styles.noMoreAds}>Plus de mentors ici !</div>
      <div className={styles.questionBlock}>
        Vous voulez partager votre expertise ?<br />
        <span className={styles.questionBold}>Devenez mentor à votre tour !</span>
      </div>
      <button className={styles.creerAvenirBtn}>Devenir mentor</button>
    </div>
  );

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Les mentors qui partagent <span className={styles.highlight}>leur expertise.</span>
      </h2>
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchBar}>
          <Image src="/Icon_Recherche.svg" alt="" width={24} height={24} className={styles.iconRecherche} />
          <input
            className={styles.input}
            type="text"
            placeholder="Rechercher un mentor par nom ou expertise"
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
        <div className={styles.menuPopup}>Sélectionnez un secteur d'expertise (exemple)</div>
      )}
      {showFilters && (
        <div className={styles.menuPopup}>Filtres avancés (exemple)</div>
      )}
      <div className={styles.mentorsGrid}>
        {loading ? (
          // État de chargement
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Chargement des mentors...</p>
          </div>
        ) : error ? (
          // État d'erreur
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={fetchMentors}
              className={styles.retryButton}
            >
              Réessayer
            </button>
          </div>
        ) : filteredMentors.length === 0 ? (
          // Aucun mentor trouvé
          <div className={styles.emptyContainer}>
            <p className={styles.emptyMessage}>
              {search ? 
                `Aucun mentor trouvé pour "${search}"` : 
                'Aucun mentor disponible pour le moment'
              }
            </p>
            {search && (
              <button 
                onClick={() => setSearch('')}
                className={styles.clearSearchButton}
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          // Affichage des mentors
          <>
            {filteredMentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
            <BlocFinMentors />
          </>
        )}
      </div>
    </section>
  );
};

export default MentorsSection;