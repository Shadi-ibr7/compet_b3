'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IArticle } from '@/types/interfaces/article.interface';
import styles from '@/components/Blog/BlogPage.module.css';

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
    <main className={styles.main}>
        <Link href="/blog" className={styles.backLink}>← Retour aux articles</Link>
        
        <article className={styles.singleArticle}>
          <div className={styles.articleImageWrapper}>
            <Image
              src={article.imageUrl || '/placeholder_article.png'}
              alt={article.title}
              width={800}
              height={400}
              className={styles.articleImage}
              priority
              unoptimized={article.imageUrl?.startsWith('http')}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/placeholder_article.png';
              }}
            />
          </div>

          <div className={styles.articleContent}>
            <h1 className={styles.articleTitle}>{article.title}</h1>
            
            <div className={styles.articleMeta}>
              <span className={styles.articleAuthor}>Par {article.auteur}</span>
              <span className={styles.articleDate}>
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {article.meta?.description && (
              <p className={styles.articleDescription}>{article.meta.description}</p>
            )}

            {article.meta?.keywords && (
              <div className={styles.articleTags}>
                {article.meta.keywords.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}

            <div className={styles.articleBody}>
              {article.content}
            </div>

            {article.lienPodcast && (
              <div className={styles.podcastSection}>
                <h2 className={styles.podcastTitle}>Écouter le podcast</h2>
                <div className={styles.podcastPlayer}>
                  <audio controls className={styles.audioPlayer}>
                    <source src={article.lienPodcast} type="audio/mpeg" />
                    Votre navigateur ne supporte pas la lecture audio
                  </audio>
                  <a 
                    href={article.lienPodcast}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.podcastDownload}
                  >
                    Télécharger le podcast
                  </a>
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
  );
}
