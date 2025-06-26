'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { IArticle } from '@/types/interfaces/article.interface';
import AdminArticleCard from './AdminArticleCard';
import styles from '@/styles/AdminDashboard.module.css';

export default function AdminArticlesSection() {
  const router = useRouter();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/articles');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des articles');
      }
      
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      console.error('Erreur lors du chargement des articles:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      // Mettre à jour la liste locale
      setArticles(prev => prev.filter(article => article.id !== articleId));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error; // Rethrow pour que le composant card puisse gérer l'erreur
    }
  };

  const handleCreateArticle = () => {
    router.push('/articles/new');
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Gestion des Articles</h2>
          <button 
            onClick={handleCreateArticle}
            className={styles.addButton}
          >
            Nouvel Article
          </button>
        </div>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement des articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Gestion des Articles</h2>
          <button 
            onClick={handleCreateArticle}
            className={styles.addButton}
          >
            Nouvel Article
          </button>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            onClick={fetchArticles}
            className={styles.retryButton}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Gestion des Articles ({articles.length})</h2>
        <button 
          onClick={handleCreateArticle}
          className={styles.addButton}
        >
          Nouvel Article
        </button>
      </div>
      
      {/* Barre de recherche */}
      {articles.length > 0 && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Rechercher par titre, auteur ou contenu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}
      
      {articles.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Aucun article n'a été créé pour le moment.</p>
          <p>Créez votre premier article pour commencer à alimenter le blog Molty.</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Aucun article ne correspond à votre recherche.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className={styles.clearSearchButton}
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        <div className={styles.articlesGrid}>
          {filteredArticles.map((article) => (
            <AdminArticleCard
              key={article.id}
              article={article}
              onDelete={handleDeleteArticle}
            />
          ))}
        </div>
      )}
      
      {/* Statistiques en bas */}
      {articles.length > 0 && (
        <div className={styles.articlesStats}>
          <p className={styles.statsText}>
            {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} affiché{filteredArticles.length > 1 ? 's' : ''} 
            {searchTerm && ` sur ${articles.length} total`}
          </p>
        </div>
      )}
    </div>
  );
}