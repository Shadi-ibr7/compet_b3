import React from "react";
import styles from "./AnnoncesSection.module.css";

const BlocFinAnnonces = () => (
  <div className={styles.blocFinWrapper}>
    <div className={styles.noMoreAds}>Pas plus d'annonces ici !</div>
    <div className={styles.questionBlock}>
      Et si au lieu de chercher un travail,<br />
      <span className={styles.questionBold}>vous en créiez un&nbsp;?</span>
    </div>
    <button className={styles.creerAvenirBtn}>Créer mon avenir</button>
  </div>
);

export default BlocFinAnnonces; 