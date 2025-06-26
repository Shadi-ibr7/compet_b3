"use client";
import React, { useEffect, useRef } from "react";
import styles from "@/styles/Frame54.module.css";

const stats = [
  {
    value: '50%',
    label: <>des français déclarent vouloir <span className={styles.highlightLabel}>acheter local</span></>
  },
  {
    value: '+12%',
    label: <>c&apos;est le <span className={styles.highlightLabel}>nombre d&apos;ouvertures de</span> commerces indépendants</>
  }
];

const Frame54 = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.contentWrapper}>
        <div className={styles.textColumn}>
          <h2 className={styles.title}>
            Parce qu&apos;un projet ne se réalise <span className={styles.highlightTitle}>jamais seul</span>
          </h2>
          <div className={styles.descBlock}>
            <p className={styles.desc}>
              Ouvrir un commerce de proximité, ce n&apos;est pas juste trouver un local :
              <b> c&apos;est créer un projet qui vous ressemble,</b>
              utile à votre <b>quartier</b>, et <b>durable</b> dans le temps.
              Chez nous, <b>vous n&apos;êtes pas seul.</b>
            </p>
          </div>
          <button className={styles.cta}>Me faire accompagner</button>
        </div>
        <div className={styles.statsColumn}>
          {stats.map((stat, i) => (
            <div className={styles.stat} key={i}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Frame54; 