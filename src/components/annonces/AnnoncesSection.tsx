'use client';
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import styles from "./AnnoncesSection.module.css";
import JobCard, { Job } from "./JobCard";

// Constantes pour les filtres
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

// Mapping pour détecter le secteur depuis nomMetier
const detecterSecteur = (nomMetier: string): string => {
  const metierLower = nomMetier.toLowerCase();
  
  if (metierLower.includes('boulang')) return 'Boulangerie';
  if (metierLower.includes('boucher')) return 'Boucherie';
  if (metierLower.includes('coiffeur') || metierLower.includes('coiffure')) return 'Coiffure';
  if (metierLower.includes('épicier') || metierLower.includes('epicier')) return 'Épicerie';
  if (metierLower.includes('pharmac')) return 'Pharmacie';
  if (metierLower.includes('fleur')) return 'Fleuriste';
  if (metierLower.includes('serveur') || metierLower.includes('cuisine') || metierLower.includes('restaur')) return 'Restauration';
  if (metierLower.includes('libraire') || metierLower.includes('livre')) return 'Librairie';
  if (metierLower.includes('bijou')) return 'Bijouterie';
  if (metierLower.includes('cordonn')) return 'Cordonnerie';
  if (metierLower.includes('pressing') || metierLower.includes('nettoyage')) return 'Pressing';
  if (metierLower.includes('optic') || metierLower.includes('lunette')) return 'Opticien';
  
  return 'Autres';
};

const AnnoncesSection = () => {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';
  const [search, setSearch] = useState(searchFromUrl);
  const [showLocation, setShowLocation] = useState(false);
  const [showSector, setShowSector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Nouveaux states pour les filtres
  const [selectedLocation, setSelectedLocation] = useState('Toutes les villes');
  const [selectedSector, setSelectedSector] = useState('Tous les secteurs');
  
  // Nouveaux states pour les données réelles
  const [annonces, setAnnonces] = useState<IAnnonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<IAnnonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterAnnonces = useCallback(() => {
    let filtered = [...annonces];

    // Filtrage par recherche textuelle
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(annonce => 
        annonce.nomMetier?.toLowerCase().includes(searchLower) ||
        annonce.nomEtablissement?.toLowerCase().includes(searchLower) ||
        annonce.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrage par localisation
    if (selectedLocation && selectedLocation !== 'Toutes les villes') {
      filtered = filtered.filter(annonce => {
        const localisationLower = annonce.localisation?.toLowerCase() || '';
        return localisationLower.includes(selectedLocation.toLowerCase());
      });
    }

    // Filtrage par secteur
    if (selectedSector && selectedSector !== 'Tous les secteurs') {
      filtered = filtered.filter(annonce => {
        const secteurDetecte = detecterSecteur(annonce.nomMetier || '');
        return secteurDetecte === selectedSector;
      });
    }
    
    setFilteredAnnonces(filtered);
  }, [search, selectedLocation, selectedSector, annonces]);

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
          <div className={styles.filterHeader}>Sélectionnez un secteur</div>
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
              {search || selectedLocation !== 'Toutes les villes' || selectedSector !== 'Tous les secteurs' ? 
                'Aucune annonce trouvée avec ces critères' : 
                'Aucune annonce disponible pour le moment'
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