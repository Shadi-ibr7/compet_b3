import React from "react";
import Image from "next/image";
import styles from "./BlogPage.module.css";
import { IArticle } from '@/types/interfaces/article.interface';

export default function FeaturedArticleCard({ article }: { article: IArticle }) {
  const formattedDate = new Date(article.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={styles.featuredCard}>
      <div className={styles.featuredImageWrapper}>
        <Image 
          className={styles.featuredImage} 
          width={800} 
          height={400} 
          alt={article.title} 
          src={article.imageUrl || '/placeholder_article.png'}
          unoptimized={article.imageUrl?.startsWith('http')}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/placeholder_article.png';
          }}
          priority
        />
      </div>
      <button className={styles.bookmarkBtn} aria-label="Ajouter aux favoris">
        <Image src="/BookmarkMobile.svg" alt="Bookmark" width={20} height={20} />
      </button>
      <div className={styles.featuredContent}>
        <h2 className={styles.featuredTitle}>{article.title}</h2>
        {article.meta?.description && (
          <p className={styles.featuredDesc}>
            <span className={styles.featuredDescLabel}>Description :</span> {article.meta.description}
          </p>
        )}
        <div className={styles.featuredDate}>
          <Image src="/Group1.svg" alt="Date" width={16} height={16} /> 
          {formattedDate}
        </div>
      </div>
    </div>
  );
} 