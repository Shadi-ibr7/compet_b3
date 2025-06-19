import React from "react";
import Image from "next/image";
import styles from "./BlogPage.module.css";

export default function FeaturedArticleCard({ article }: { article: any }) {
  return (
    <div className={styles.featuredCard}>
      <Image className={styles.featuredImage} width={341} height={173} alt={article.title} src={article.image} />
      <button className={styles.bookmarkBtn} aria-label="Ajouter aux favoris">
        <Image src="/BookmarkMobile.svg" alt="Bookmark" width={20} height={20} />
      </button>
      <div className={styles.featuredContent}>
        <div className={styles.featuredTitle}>{article.title}</div>
        <div className={styles.featuredDesc}><span className={styles.featuredDescLabel}>Description :</span> {article.desc}</div>
        <div className={styles.featuredDate}><Image src="/Group1.svg" alt="Date" width={16} height={16} /> {article.date}</div>
      </div>
    </div>
  );
} 