'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IArticle } from '@/types/interfaces/article.interface';
import SafeHtml from '@/components/Security/SafeHtml';
import styles from '@/components/Blog/BlogPage.module.css';
import ArticleRecommendations from '@/components/Blog/ArticleRecommendations';
import AudioPlayer from '@/components/Blog/AudioPlayer';

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError('Erreur lors du chargement de l\'article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [params]);

  if (loading) return (
    <main className={styles.main}>
      <div className={styles.loader}>Chargement de l'article...</div>
    </main>
  );

  if (error || !article) return (
    <main className={styles.main}>
      <div className={styles.error}>{error || 'Article non trouvé'}</div>
      <Link href="/blog" className={styles.backLink}>← Retour aux articles</Link>
    </main>
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <Link href="/blog" className={styles.backLink}>← Blog</Link>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWithHighlight}>
              <h3>{article.title}</h3>
            </div>
          </div>
          
          <div className={styles.profileCard}>
            <Image
              src={article.imageUrl || '/placeholder_article.png'}
              alt={article.title}
              width={80}
              height={80}
              className={styles.avatar}
              unoptimized={article.imageUrl?.startsWith('http')}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/placeholder_article.png';
              }}
            />
            <div className={styles.profileInfo}>
              <h2>{article.auteur}</h2>
              <p className={styles.jobTitle}>
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {article.meta?.keywords && (
                <div className={styles.location}>
                  {article.meta.keywords.slice(0, 2).map((tag, index) => (
                    <span key={index} className={styles.tagSimple}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {article.meta?.description && (
            <p className={styles.subtitle}>{article.meta.description}</p>
          )}

          <div className={styles.content}>
            <SafeHtml 
              html={article.content || ''} 
              variant="full"
              className={styles.htmlContent}
              maxLength={10000}
            />
          </div>

          {article.lienPodcast && (
            <div>
              <h4 className={styles.podcastTitle}>🎧 Podcast</h4>
              <AudioPlayer 
                src={article.lienPodcast} 
                title={`Podcast - ${article.title}`}
              />
            </div>
          )}
        </div>

        <ArticleRecommendations currentArticle={article} />
      </main>
    </div>
  );
}
