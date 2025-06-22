'use client';
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import styles from "./AnnoncesSection.module.css";
import JobCard, { Job } from "./JobCard";

const AnnoncesSection = () => {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchFromUrl);
  const [showLocation, setShowLocation] = useState(false);
  const [showSector, setShowSector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Nouveaux states pour les données réelles
  const [annonces, setAnnonces] = useState<IAnnonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<IAnnonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterAnnonces = useCallback(() => {
    if (!search.trim()) {
      setFilteredAnnonces(annonces);
      return;
    }

    console.log('🔍 Filtrage des annonces avec la recherche:', search);
    const searchLower = search.toLowerCase();
    const filtered = annonces.filter(annonce => 
      annonce.nomMetier?.toLowerCase().includes(searchLower) ||
      annonce.nomEtablissement?.toLowerCase().includes(searchLower) ||
      annonce.description?.toLowerCase().includes(searchLower)
    );
    
    setFilteredAnnonces(filtered);
  }, [search, annonces]);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/annonces');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des annonces');
      }
      
      const data = await response.json();
      setAnnonces(data);
      setFilteredAnnonces(data);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les annonces. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les annonces depuis l'API
  useEffect(() => {
    fetchAnnonces();
  }, []);

  // Filtrer les annonces quand la recherche change
  useEffect(() => {
    filterAnnonces();
  }, [filterAnnonces]);

  // Mettre à jour la recherche quand l'URL change
  useEffect(() => {
    setSearch(searchFromUrl);
  }, [searchFromUrl]);

  const BlocFinAnnonces = () => (
    <div className={styles.blocFinWrapper}>
      <div className={styles.noMoreAds}>Pas plus d&apos;annonces ici !</div>
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
        {loading ? (
          // État de chargement
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Chargement des annonces...</p>
          </div>
        ) : error ? (
          // État d'erreur
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={fetchAnnonces}
              className={styles.retryButton}
            >
              Réessayer
            </button>
          </div>
        ) : filteredAnnonces.length === 0 ? (
          // Aucune annonce trouvée
          <div className={styles.emptyContainer}>
            <p className={styles.emptyMessage}>
              {search ? 
                `Aucune annonce trouvée pour "${search}"` : 
                'Aucune annonce disponible pour le moment'
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
          // Affichage des annonces
          <>
            {filteredAnnonces.map(annonce => (
              <JobCard key={annonce.id} annonce={annonce} />
            ))}
            <BlocFinAnnonces />
          </>
        )}
      </div>
    </section>
  );
};

export default AnnoncesSection; 