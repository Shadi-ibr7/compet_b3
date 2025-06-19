import React from "react";
import type { NextPage } from 'next';
import Image from 'next/image';
import styles from "@/styles/Frame58.module.css";

const Frame58: NextPage = () => {
  return (
    <section className={styles.section}>
      <div className={styles.introBlock}>
        <h2 className={styles.title}>
          <span className={styles.highlight}>Vous êtes passé</span> par là.<br />
          <span>Vous savez ce que ça demande.</span>
        </h2>
        <div className={styles.descBlock}>
          <p>
            Vous avez de l&apos;expérience dans le commerce de proximité et l&apos;accompagnement.
          </p>
          <p>
            <strong className={styles.strong}>Rejoignez</strong> notre réseau de mentors et accompagnez les <strong className={styles.strong}>commerçants de demain.</strong>
          </p>
        </div>
      </div>
      <div className={styles.ctaBlock}>
        <div className={styles.ctaText}>
          <strong>Envie de rejoindre notre réseau</strong> de mentors ? <br />Écrivez-nous directement sur WhatsApp<br />
        </div>
        <a
          href="https://wa.me/33600000000"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappBtn}
        >
          <Image src="/logowhatsapp.svg" alt="" width={20} height={20} />
          <span>Nous contacter sur WhatsApp</span>
        </a>
      </div>
    </section>
  );
};

export default Frame58; 