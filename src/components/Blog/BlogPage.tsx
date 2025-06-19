'use client';
import React, { useState } from "react";
import styles from "./BlogPage.module.css";
import FeaturedArticleCard from "./FeaturedArticleCard";
import ArticleCard from "./ArticleCard";
import BlocFinAnnonces from "../Annonces/BlocFinAnnonces";

const featured = {
  image: "/image.png",
  title: "5 peurs courantes avant une reconversion et comment les dépasser",
  desc: "Changer de voie professionnelle est une aventure aussi exaltante qu'angoissante. Avant même de franchir le pas, de nombreuses peurs surgissent...",
  date: "3 juin 2025"
};

const articles = [
  featured,
  featured,
  featured,
  featured
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
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
      <FeaturedArticleCard article={featured} />
      <h2 className={styles.sectionTitle}>Plus d'articles</h2>
      <div className={styles.articlesList}>
        {articles.map((a, i) => (
          <ArticleCard key={i} article={a} />
        ))}
      </div>
      <BlocFinAnnonces articles />
    </main>
  );
} 