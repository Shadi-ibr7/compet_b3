import React from "react";
import Image from "next/image";
import styles from "./BlogPage.module.css";
import { IArticle } from '@/types/interfaces/article.interface';

export default function ArticleCard({ article }: { article: IArticle }) {
  return (
    <div className={styles.articleCard}>
      <Image className={styles.articleImage} width={64} height={64} alt={article.title} src={article.imageUrl} />
      <div className={styles.articleContent}>
        <div className={styles.articleTitle}>{article.title}</div>
        <div className={styles.articleDate}><Image src="/Group1.svg" alt="Date" width={16} height={16} /> {article.date}</div>
      </div>
      <button className={styles.bookmarkBtn} aria-label="Ajouter aux favoris">
        <Image src="/BookmarkMobile.svg" alt="Bookmark" width={20} height={20} />
      </button>
    </div>
  );
} 