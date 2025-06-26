'use client';
import React, { useEffect, useState, useMemo } from "react";
import styles from "./BlogPage.module.css";
import FeaturedArticleCard from "./FeaturedArticleCard";
import ArticleCard from "./ArticleCard";
import BlocFinAnnonces from "../annonces/BlocFinAnnonces";
import { IArticle } from '@/types/interfaces/article.interface';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data);
      } catch {
        setError('Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Filtrage des articles en temps réel
  const filteredArticles = useMemo(() => {
    if (!search.trim()) {
      return articles;
    }

    const searchLower = search.toLowerCase();
    return articles.filter(article => 
      article.title?.toLowerCase().includes(searchLower) ||
      article.auteur?.toLowerCase().includes(searchLower) ||
      article.meta?.description?.toLowerCase().includes(searchLower) ||
      article.meta?.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      )
    );
  }, [articles, search]);

  if (loading) return <div className={styles.loader}>Chargement des articles...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!articles.length) return <div className={styles.error}>Aucun article trouvé.</div>;

  const featured = filteredArticles[0];
  const moreArticles = filteredArticles.slice(1);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Blog</h1>
      <div className={styles.searchBarWrapper}>
        <div className={styles.searchInputContainer}>
          <Image src="/Icon_Recherche.svg" alt="" width={24} height={24} className={styles.searchIcon} />
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Rechercher un article par titre, auteur ou mot-clé"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className={styles.clearButton}
              title="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>
        {search && (
          <div className={styles.searchResults}>
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''} pour "{search}"
          </div>
        )}
      </div>

      {filteredArticles.length === 0 && search ? (
        <div className={styles.noResults}>
          <h2 className={styles.noResultsTitle}>Aucun article trouvé</h2>
          <p className={styles.noResultsText}>
            Aucun article ne correspond à votre recherche "{search}".
          </p>
          <button 
            onClick={() => setSearch('')}
            className={styles.clearSearchBtn}
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        <>
          {featured && (
            <>
              <h2 className={styles.sectionTitle}>
                {search ? 'Premier résultat' : 'À la une'}
              </h2>
              <Link href={`/blog/${featured.id}`} style={{ textDecoration: 'none' }}>
                <FeaturedArticleCard article={featured} />
              </Link>
            </>
          )}
          
          {moreArticles.length > 0 && (
            <>
              <h2 className={styles.sectionTitle}>
                {search ? 'Autres résultats' : 'Plus d\'articles'}
              </h2>
              <div className={styles.articlesList}>
                {moreArticles.map((a) => (
                  <Link key={a.id} href={`/blog/${a.id}`} style={{ textDecoration: 'none' }}>
                    <ArticleCard article={a} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
      
      <BlocFinAnnonces />
    </main>
  );
} 