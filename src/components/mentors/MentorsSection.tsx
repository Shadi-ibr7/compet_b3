'use client';
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import styles from "../annonces/AnnoncesSection.module.css";
import MentorCard from "./MentorCard";

// Constantes pour les filtres mentors
const VILLES_FRANCE = [
  'Toutes les villes',
  'Paris',
  'Lyon',
  'Marseille',
  'Toulouse',
  'Nice',
  'Nantes',
  'Strasbourg',
  'Montpellier',
  'Bordeaux',
  'Lille',
  'Rennes',
  'Reims',
  'Le Havre',
  'Saint-Étienne',
  'Toulon',
  'Grenoble',
  'Dijon',
  'Angers',
  'Nîmes'
];

const SECTEURS_COMMERCE = [
  'Tous les secteurs',
  'Boulangerie',
  'Boucherie',
  'Coiffure',
  'Épicerie',
  'Pharmacie',
  'Fleuriste',
  'Restauration',
  'Librairie',
  'Bijouterie',
  'Cordonnerie',
  'Pressing',
  'Opticien'
];

// Mapping pour détecter le secteur depuis job (identique aux annonces)
const detecterSecteurMentor = (job: string): string => {
  const jobLower = job.toLowerCase();
  
  if (jobLower.includes('boulang')) return 'Boulangerie';
  if (jobLower.includes('boucher')) return 'Boucherie';
  if (jobLower.includes('coiffeur') || jobLower.includes('coiffure')) return 'Coiffure';
  if (jobLower.includes('épicier') || jobLower.includes('epicier')) return 'Épicerie';
  if (jobLower.includes('pharmac')) return 'Pharmacie';
  if (jobLower.includes('fleur')) return 'Fleuriste';
  if (jobLower.includes('serveur') || jobLower.includes('cuisine') || jobLower.includes('restaur')) return 'Restauration';
  if (jobLower.includes('libraire') || jobLower.includes('livre')) return 'Librairie';
  if (jobLower.includes('bijou')) return 'Bijouterie';
  if (jobLower.includes('cordonn')) return 'Cordonnerie';
  if (jobLower.includes('pressing') || jobLower.includes('nettoyage')) return 'Pressing';
  if (jobLower.includes('optic') || jobLower.includes('lunette')) return 'Opticien';
  
  return 'Autres';
};

const MentorsSection = () => {
  const [search, setSearch] = useState("");
  const [showLocation, setShowLocation] = useState(false);
  const [showSector, setShowSector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Nouveaux states pour les filtres
  const [selectedLocation, setSelectedLocation] = useState('Toutes les villes');
  const [selectedSector, setSelectedSector] = useState('Tous les secteurs');
  
  // States pour les données réelles
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les mentors depuis l'API
  useEffect(() => {
    fetchMentors();
  }, []);

  // Filtrer les mentors quand la recherche ou les filtres changent
  useEffect(() => {
    filterMentors();
  }, [search, selectedLocation, selectedSector, mentors]);

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

  const filterMentors = useCallback(() => {
    let filtered = [...mentors];

    // Filtrage par recherche textuelle
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(mentor => 
        mentor.nom?.toLowerCase().includes(searchLower) ||
        mentor.job?.toLowerCase().includes(searchLower) ||
        mentor.description?.toLowerCase().includes(searchLower) ||
        mentor.localisation?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrage par localisation
    if (selectedLocation && selectedLocation !== 'Toutes les villes') {
      filtered = filtered.filter(mentor => {
        const localisationLower = mentor.localisation?.toLowerCase() || '';
        return localisationLower.includes(selectedLocation.toLowerCase());
      });
    }

    // Filtrage par secteur
    if (selectedSector && selectedSector !== 'Tous les secteurs') {
      filtered = filtered.filter(mentor => {
        const secteurDetecte = detecterSecteurMentor(mentor.job || '');
        return secteurDetecte === selectedSector;
      });
    }
    
    setFilteredMentors(filtered);
  }, [search, selectedLocation, selectedSector, mentors]);

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
        <button 
          className={`${styles.filterBtn} ${selectedLocation !== 'Toutes les villes' ? styles.filterBtnActive : ''}`}
          onClick={() => setShowLocation(v => !v)}
        >
          <Image src="/Union.svg" alt="" width={13} height={16} className={styles.filterIcon} />
          <span>Localisation</span>
          {selectedLocation !== 'Toutes les villes' && <span className={styles.filterDot}></span>}
        </button>
        <button 
          className={`${styles.filterBtn} ${selectedSector !== 'Tous les secteurs' ? styles.filterBtnActive : ''}`}
          onClick={() => setShowSector(v => !v)}
        >
          <Image src="/Vector2.svg" alt="" width={16} height={16} className={styles.filterIcon} />
          <span>Secteur</span>
          {selectedSector !== 'Tous les secteurs' && <span className={styles.filterDot}></span>}
        </button>
        <button className={styles.filterBtnDark} onClick={() => setShowFilters(v => !v)}>
          <Image src="/Vector_Stroke.svg" alt="" width={16} height={11} className={styles.filterIcon} />
          <span>Plus de filtres</span>
        </button>
      </div>

      {/* Indicateur et reset des filtres actifs */}
      {(selectedLocation !== 'Toutes les villes' || selectedSector !== 'Tous les secteurs') && (
        <div className={styles.activeFiltersBar}>
          <div className={styles.activeFiltersInfo}>
            <span className={styles.activeFiltersText}>
              Filtres actifs : 
              {selectedLocation !== 'Toutes les villes' && (
                <span className={styles.activeFilterTag}>{selectedLocation}</span>
              )}
              {selectedSector !== 'Tous les secteurs' && (
                <span className={styles.activeFilterTag}>{selectedSector}</span>
              )}
            </span>
          </div>
          <button 
            className={styles.resetFiltersBtn}
            onClick={() => {
              setSelectedLocation('Toutes les villes');
              setSelectedSector('Tous les secteurs');
              setShowLocation(false);
              setShowSector(false);
            }}
          >
            ✕ Effacer tous les filtres
          </button>
        </div>
      )}
      
      {/* Dropdown Localisation */}
      {showLocation && (
        <div className={styles.menuPopup}>
          <div className={styles.filterHeader}>Sélectionnez une localisation</div>
          <div className={styles.filterOptions}>
            {VILLES_FRANCE.map((ville) => (
              <button
                key={ville}
                className={`${styles.filterOption} ${selectedLocation === ville ? styles.filterOptionActive : ''}`}
                onClick={() => {
                  setSelectedLocation(ville);
                  setShowLocation(false);
                }}
              >
                {ville}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown Secteur */}
      {showSector && (
        <div className={styles.menuPopup}>
          <div className={styles.filterHeader}>Sélectionnez un secteur d'expertise</div>
          <div className={styles.filterOptions}>
            {SECTEURS_COMMERCE.map((secteur) => (
              <button
                key={secteur}
                className={`${styles.filterOption} ${selectedSector === secteur ? styles.filterOptionActive : ''}`}
                onClick={() => {
                  setSelectedSector(secteur);
                  setShowSector(false);
                }}
              >
                {secteur}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filtres avancés placeholder */}
      {showFilters && (
        <div className={styles.menuPopup}>
          <div className={styles.filterHeader}>Filtres avancés</div>
          <p>Fonctionnalité à venir...</p>
        </div>
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
              {search || selectedLocation !== 'Toutes les villes' || selectedSector !== 'Tous les secteurs' ? 
                'Aucun mentor trouvé avec ces critères' : 
                'Aucun mentor disponible pour le moment'
              }
            </p>
            {(search || selectedLocation !== 'Toutes les villes' || selectedSector !== 'Tous les secteurs') && (
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedLocation('Toutes les villes');
                  setSelectedSector('Tous les secteurs');
                }}
                className={styles.clearFiltersButton}
              >
                Effacer tous les filtres
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