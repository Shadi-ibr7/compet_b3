'use client';
import React, { useEffect, useState } from "react";
import styles from "./BlogPage.module.css";
import FeaturedArticleCard from "./FeaturedArticleCard";
import ArticleCard from "./ArticleCard";
import BlocFinAnnonces from "../Annonces/BlocFinAnnonces";
import { IArticle } from '@/types/interfaces/article.interface';
import Link from 'next/link';

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
      } catch (err) {
        setError('Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <div className={styles.loader}>Chargement des articles...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!articles.length) return <div className={styles.error}>Aucun article trouvé.</div>;

  const featured = articles[0];
  const moreArticles = articles.slice(1);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Blog</h1>
      <div className={styles.searchBarWrapper}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Rechercher une annonce par domaine"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <h2 className={styles.sectionTitle}>À la une</h2>
      <Link href={`/blogs/${featured.id}`} style={{ textDecoration: 'none' }}>
        <FeaturedArticleCard article={featured} />
      </Link>
      <h2 className={styles.sectionTitle}>Plus d'articles</h2>
      <div className={styles.articlesList}>
        {moreArticles.map((a) => (
          <Link key={a.id} href={`/blogs/${a.id}`} style={{ textDecoration: 'none' }}>
            <ArticleCard article={a} />
          </Link>
        ))}
      </div>
      <BlocFinAnnonces articles />
    </main>
  );
} 