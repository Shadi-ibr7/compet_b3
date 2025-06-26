import React from "react";
import Image from "next/image";
import styles from "./BlogPage.module.css";
import { IArticle } from '@/types/interfaces/article.interface';

export default function ArticleCard({ article }: { article: IArticle }) {
  const formattedDate = new Date(article.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={styles.articleCard}>
      <div className={styles.articleImageWrapper}>
        <Image 
          className={styles.articleImage} 
          width={200} 
          height={200} 
          alt={article.title} 
          src={article.imageUrl || '/placeholder_article.png'}
          unoptimized={article.imageUrl?.startsWith('http')}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = '/placeholder_article.png';
          }}
        />
      </div>
      <div className={styles.articleContent}>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        <div className={styles.articleDate}>
          <Image src="/Group1.svg" alt="Date" width={16} height={16} /> 
          {formattedDate}
        </div>
      </div>
    </div>
  );
} 