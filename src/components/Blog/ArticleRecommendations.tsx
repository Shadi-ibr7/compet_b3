'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleCard from './ArticleCard';
import styles from './BlogPage.module.css';
import { IArticle } from '@/types/interfaces/article.interface';

interface ArticleRecommendationsProps {
  currentArticle: IArticle;
}

export default function ArticleRecommendations({ currentArticle }: ArticleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const allArticles: IArticle[] = await response.json();
        
        // Exclure l'article actuel
        const otherArticles = allArticles.filter(article => article.id !== currentArticle.id);
        
        // Calculer le score de similarité basé sur les mots-clés
        const scoredArticles = otherArticles.map(article => {
          let score = 0;
          const currentKeywords = currentArticle.meta?.keywords || [];
          const articleKeywords = article.meta?.keywords || [];
          
          // Compter les mots-clés en commun
          currentKeywords.forEach(keyword => {
            if (articleKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())) {
              score++;
            }
          });
          
          return { article, score };
        });
        
        // Trier par score décroissant et prendre les 3 premiers
        const topRecommendations = scoredArticles
          .filter(item => item.score > 0) // Garder seulement ceux avec au moins 1 mot-clé en commun
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(item => item.article);
        
        // Si moins de 3 recommandations avec mots-clés communs, compléter avec des articles récents
        if (topRecommendations.length < 3) {
          const remainingCount = 3 - topRecommendations.length;
          const recentArticles = otherArticles
            .filter(article => !topRecommendations.some(rec => rec.id === article.id))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, remainingCount);
          
          topRecommendations.push(...recentArticles);
        }
        
        setRecommendations(topRecommendations);
      } catch (error) {
        console.error('Erreur lors du chargement des recommandations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentArticle.id, currentArticle.meta?.keywords]);

  if (loading) {
    return (
      <div className={styles.recommendationsSection}>
        <h2 className={styles.sectionTitle}>Articles recommandés</h2>
        <div className={styles.loader}>Chargement des recommandations...</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={styles.recommendationsSection}>
      <div className={styles.titleWithHighlight}>
        <h3>Articles recommandés</h3>
      </div>
      <div className={styles.recommendationsList}>
        {recommendations.map((article) => (
          <Link key={article.id} href={`/blog/${article.id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.recommendationCard}>
              <img 
                src={article.imageUrl || '/placeholder_article.png'} 
                alt={article.title}
                className={styles.recommendationImage}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/placeholder_article.png';
                }}
              />
              <div className={styles.recommendationContent}>
                <h4 className={styles.recommendationTitle}>{article.title}</h4>
                <p className={styles.recommendationDate}>
                  {new Date(article.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}