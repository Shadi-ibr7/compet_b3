import React from "react";
import styles from "@/styles/Frame54.module.css";

const stats = [
  {
    value: '50%',
    label: <>des français déclarent vouloir <span className={styles.highlight}>acheter local</span></>
  },
  {
    value: '+12%',
    label: <><span>c&apos;est</span> <span className={styles.highlight}>le nombre d&apos;ouvertures</span> <span className={styles.highlight}>de</span> commerces indépendants</>
  }
];

const Frame54 = () => (
  <section className={styles.section}>
    <div className={styles.ellipseTop} />
    <div className={styles.ellipseBottom} />
    <div className={styles.introBlock}>
      <h2 className={styles.title}>
        Parce qu&apos;un projet ne se réalise
        <span className={styles.highlight}> jamais seul</span>
      </h2>
      <div className={styles.descBlock}>
        <p className={styles.desc}>
          Ouvrir un commerce de proximité, ce n&apos;est pas juste trouver un local :
          <b> c&apos;est créer un projet qui vous ressemble,</b>
          utile à votre <b>quartier</b>, et <b>durable</b> dans le temps.
        </p>
        <p /*className={styles.desc}*/>
          Chez nous, <b>vous n&apos;êtes pas seul.</b>
        </p>
      </div>
    </div>
    <div className={styles.statsCtaBlock}>
      <div className={styles.statsBlock}>
        {stats.map((stat, i) => (
          <div className={styles.stat} key={i}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
      <button className={styles.cta}>Me faire accompagner</button>
    </div>
  </section>
);

export default Frame54; 