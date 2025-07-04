'use client';
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import { AnnonceType, ANNONCE_TYPE_CONFIG } from "@/types/enums/annonce-types.enum";
import styles from "./AnnoncesSection.module.css";
import JobCard, { Job } from "./JobCard";

// Constantes pour les filtres annonces
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

const TYPES_ANNONCES = [
  'Tous les types',
  ...Object.values(AnnonceType)
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

// Mapping pour détecter le secteur depuis nomMetier ou nomEtablissement
const detecterSecteurAnnonce = (nomMetier: string, nomEtablissement: string): string => {
  const text = `${nomMetier} ${nomEtablissement}`.toLowerCase();
  
  if (text.includes('boulang')) return 'Boulangerie';
  if (text.includes('boucher')) return 'Boucherie';
  if (text.includes('coiffeur') || text.includes('coiffure')) return 'Coiffure';
  if (text.includes('épicier') || text.includes('epicier')) return 'Épicerie';
  if (text.includes('pharmac')) return 'Pharmacie';
  if (text.includes('fleur')) return 'Fleuriste';
  if (text.includes('serveur') || text.includes('cuisine') || text.includes('restaur')) return 'Restauration';
  if (text.includes('libraire') || text.includes('livre')) return 'Librairie';
  if (text.includes('bijou')) return 'Bijouterie';
  if (text.includes('cordonn')) return 'Cordonnerie';
  if (text.includes('pressing') || text.includes('nettoyage')) return 'Pressing';
  if (text.includes('optic') || text.includes('lunette')) return 'Opticien';
  
  return 'Autres';
};

const AnnoncesSection = () => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get("search") || "");
  
  // State centralisé pour les dropdowns - seul un peut être ouvert
  const [activeDropdown, setActiveDropdown] = useState<'location' | 'type' | 'sector' | 'filters' | null>(null);
  
  // Nouveaux states pour les filtres
  const [selectedLocation, setSelectedLocation] = useState('Toutes les villes');
  const [selectedType, setSelectedType] = useState('Tous les types');
  const [selectedSector, setSelectedSector] = useState('Tous les secteurs');
  
  // States pour les données réelles
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
        annonce.description?.toLowerCase().includes(searchLower) ||
        annonce.type?.toLowerCase().includes(searchLower) ||
        annonce.localisation?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrage par localisation
    if (selectedLocation && selectedLocation !== 'Toutes les villes') {
      filtered = filtered.filter(annonce => {
        const localisationLower = annonce.localisation?.toLowerCase() || '';
        return localisationLower.includes(selectedLocation.toLowerCase());
      });
    }

    // Filtrage par type d'annonce
    if (selectedType && selectedType !== 'Tous les types') {
      filtered = filtered.filter(annonce => annonce.type === selectedType);
    }

    // Filtrage par secteur
    if (selectedSector && selectedSector !== 'Tous les secteurs') {
      filtered = filtered.filter(annonce => {
        const secteurDetecte = detecterSecteurAnnonce(annonce.nomMetier || '', annonce.nomEtablissement || '');
        return secteurDetecte === selectedSector;
      });
    }
    
    setFilteredAnnonces(filtered);
  }, [search, selectedLocation, selectedType, selectedSector, annonces]);

  // Charger les annonces depuis l'API
  useEffect(() => {
    fetchAnnonces();
  }, []);

  // Filtrer les annonces quand la recherche ou les filtres changent
  useEffect(() => {
    filterAnnonces();
  }, [filterAnnonces]);

  // Mettre à jour la recherche quand l'URL change
  useEffect(() => {
    const searchFromUrl = searchParams?.get("search") || "";
    setSearch(searchFromUrl);
  }, [searchParams]);

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[class*="filterContainer"]') && !target.closest('[class*="dropdownMenu"]')) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

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
        <div className={styles.filterContainer}>
          <button 
            className={`${styles.filterBtn} ${selectedLocation !== 'Toutes les villes' ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
          >
            <Image src="/Union.svg" alt="" width={13} height={16} className={styles.filterIcon} />
            <span>Localisation</span>
            {selectedLocation !== 'Toutes les villes' && <span className={styles.filterDot}></span>}
          </button>
          {/* Dropdown Localisation */}
          {activeDropdown === 'location' && (
            <div className={styles.dropdownMenu}>
              <div className={styles.filterHeader}>Sélectionnez une localisation</div>
              <div className={styles.filterOptions}>
                {VILLES_FRANCE.map((ville) => (
                  <button
                    key={ville}
                    className={`${styles.filterOption} ${selectedLocation === ville ? styles.filterOptionActive : ''}`}
                    onClick={() => {
                      setSelectedLocation(ville);
                      setActiveDropdown(null);
                    }}
                  >
                    {ville}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.filterContainer}>
          <button 
            className={`${styles.filterBtn} ${selectedType !== 'Tous les types' ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
          >
            <Image src="/Vector2.svg" alt="" width={16} height={16} className={styles.filterIcon} />
            <span>Type</span>
            {selectedType !== 'Tous les types' && <span className={styles.filterDot}></span>}
          </button>
          {/* Dropdown Type */}
          {activeDropdown === 'type' && (
            <div className={styles.dropdownMenu}>
              <div className={styles.filterHeader}>Sélectionnez un type d'opportunité</div>
              <div className={styles.filterOptions}>
                {TYPES_ANNONCES.map((type) => (
                  <button
                    key={type}
                    className={`${styles.filterOption} ${selectedType === type ? styles.filterOptionActive : ''}`}
                    onClick={() => {
                      setSelectedType(type);
                      setActiveDropdown(null);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.filterContainer}>
          <button 
            className={`${styles.filterBtn} ${selectedSector !== 'Tous les secteurs' ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveDropdown(activeDropdown === 'sector' ? null : 'sector')}
          >
            <Image src="/Vector_Stroke.svg" alt="" width={16} height={11} className={styles.filterIcon} />
            <span>Secteur</span>
            {selectedSector !== 'Tous les secteurs' && <span className={styles.filterDot}></span>}
          </button>
          {/* Dropdown Secteur */}
          {activeDropdown === 'sector' && (
            <div className={styles.dropdownMenu}>
              <div className={styles.filterHeader}>Sélectionnez un secteur d'activité</div>
              <div className={styles.filterOptions}>
                {SECTEURS_COMMERCE.map((secteur) => (
                  <button
                    key={secteur}
                    className={`${styles.filterOption} ${selectedSector === secteur ? styles.filterOptionActive : ''}`}
                    onClick={() => {
                      setSelectedSector(secteur);
                      setActiveDropdown(null);
                    }}
                  >
                    {secteur}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicateur et reset des filtres actifs */}
      {(selectedLocation !== 'Toutes les villes' || selectedType !== 'Tous les types' || selectedSector !== 'Tous les secteurs') && (
        <div className={styles.activeFiltersBar}>
          <div className={styles.activeFiltersInfo}>
            <span className={styles.activeFiltersText}>
              Filtres actifs : 
              {selectedLocation !== 'Toutes les villes' && (
                <span className={styles.activeFilterTag}>{selectedLocation}</span>
              )}
              {selectedType !== 'Tous les types' && (
                <span className={styles.activeFilterTag}>{selectedType}</span>
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
              setSelectedType('Tous les types');
              setSelectedSector('Tous les secteurs');
              setActiveDropdown(null);
            }}
          >
            ✕ Effacer tous les filtres
          </button>
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
              {search || selectedLocation !== 'Toutes les villes' || selectedType !== 'Tous les types' || selectedSector !== 'Tous les secteurs' ? 
                'Aucune annonce trouvée avec ces critères' : 
                'Aucune annonce disponible pour le moment'
              }
            </p>
            {(search || selectedLocation !== 'Toutes les villes' || selectedType !== 'Tous les types' || selectedSector !== 'Tous les secteurs') && (
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedLocation('Toutes les villes');
                  setSelectedType('Tous les types');
                  setSelectedSector('Tous les secteurs');
                  setActiveDropdown(null);
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