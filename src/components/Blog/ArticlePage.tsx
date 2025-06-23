'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IArticle } from '@/types/interfaces/article.interface';
import styles from './ArticlePage.module.css';

interface ArticlePageProps {
  article: IArticle;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  return (
    <main className={styles.container}>
      <div className={styles.backNavigation}>
        <Link href="/blog" className={styles.backLink}>
          <Image src="/arrow-left.svg" width={20} height={20} alt="Retour" />
          Retour aux articles
        </Link>
      </div>

      <article className={styles.article}>
        {/* Hero Section avec image */}
        <div className={styles.heroSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={article.imageUrl || '/placeholder_article.png'}
              alt={article.title}
              width={1200}
              height={600}
              className={styles.heroImage}
              priority
              unoptimized={article.imageUrl?.startsWith('http')}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = '/placeholder_article.png';
              }}
            />
            <div className={styles.imageOverlay} />
          </div>
          
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <span>Article</span>
            </div>
            
            <h1 className={styles.title}>{article.title}</h1>
            
            <div className={styles.articleMeta}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  <Image src="/placeholder_pp.png" width={48} height={48} alt={article.auteur} />
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>{article.auteur}</span>
                  <span className={styles.publishDate}>
                    {new Date(article.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <div className={styles.readingTime}>
                <Image src="/cake.svg" width={16} height={16} alt="Temps de lecture" />
                <span>{Math.max(1, Math.ceil(article.content.length / 1000))} min de lecture</span>
              </div>
            </div>

            {article.meta?.description && (
              <p className={styles.description}>{article.meta.description}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        {article.meta?.keywords && article.meta.keywords.length > 0 && (
          <div className={styles.tagsSection}>
            <div className={styles.contentWrapper}>
              <div className={styles.tags}>
                {article.meta.keywords.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className={styles.contentSection}>
          <div className={styles.contentWrapper}>
            <div className={styles.articleContent}>
              <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            {/* Section Podcast */}
            {article.lienPodcast && (
              <div className={styles.podcastSection}>
                <div className={styles.podcastHeader}>
                  <div className={styles.podcastIcon}>
                    <Image src="/Vector.svg" width={24} height={24} alt="Podcast" />
                  </div>
                  <div>
                    <h2 className={styles.podcastTitle}>Écouter le podcast</h2>
                    <p className={styles.podcastSubtitle}>Version audio de cet article</p>
                  </div>
                </div>
                
                <div className={styles.podcastPlayer}>
                  <audio controls className={styles.audioPlayer}>
                    <source src={article.lienPodcast} type="audio/mpeg" />
                    <source src={article.lienPodcast} type="audio/wav" />
                    <source src={article.lienPodcast} type="audio/m4a" />
                    Votre navigateur ne supporte pas la lecture audio
                  </audio>
                  
                  <div className={styles.podcastActions}>
                    <a 
                      href={article.lienPodcast}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                    >
                      <Image src="/upload.svg" width={16} height={16} alt="Télécharger" />
                      Télécharger
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section de navigation */}
        <div className={styles.navigationSection}>
          <div className={styles.contentWrapper}>
            <div className={styles.articleNavigation}>
              <Link href="/blog" className={styles.backToList}>
                <Image src="/arrow-left.svg" width={20} height={20} alt="Retour" />
                Voir tous les articles
              </Link>
              
              <div className={styles.shareButtons}>
                <span className={styles.shareLabel}>Partager :</span>
                <button className={styles.shareBtn} title="Partager sur LinkedIn">
                  <Image src="/linkedin.svg" width={20} height={20} alt="LinkedIn" />
                </button>
                <button className={styles.shareBtn} title="Partager sur WhatsApp">
                  <Image src="/logowhatsapp.svg" width={20} height={20} alt="WhatsApp" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
} 