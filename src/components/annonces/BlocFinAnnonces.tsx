import React from "react";
import Link from "next/link";
import styles from "./AnnoncesSection.module.css";

const BlocFinAnnonces = () => (
  <div className={styles.blocFinWrapper}>
    <div className={styles.noMoreAds}>Pas plus d&apos;annonces ici !</div>
    <div className={styles.questionBlock}>
      Et si au lieu de chercher un travail,<br />
      <span className={styles.questionBold}>vous en créiez un&nbsp;?</span>
    </div>
    <Link href="/annonces" className={styles.creerAvenirBtn}>
      Découvrir les annonces
    </Link>
  </div>
);

export default BlocFinAnnonces; 