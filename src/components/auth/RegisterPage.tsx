import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Register.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <Link href="/">
        <Image className={styles.logo} width={85.5} height={40} alt="Molty" src="/Logotype.svg" />
      </Link>
      <h1 className={styles.title}>
        M’ <span className={styles.highlight}>inscrire</span>
      </h1>
      <div className={styles.subtitle}>
        <b>Plus de 300 mentors</b> vous attendent
      </div>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nom</label>
          <input className={styles.input} type="text" placeholder="Entrez votre nom ici" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Prénom</label>
          <input className={styles.input} type="text" placeholder="Entrez votre prénom ici" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mail</label>
          <input className={styles.input} type="email" placeholder="Entrez votre mail ici" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mot de passe</label>
          <input className={styles.input} type="password" placeholder="Entrez votre mot de passe ici" />
        </div>
        <button type="submit" className={styles.submitBtn}>S'inscrire</button>
      </form>
      <div className={styles.login}>
        <span>J'ai déjà un compte, </span>
        <Link href="/auth/signin"><b className={styles.loginLink}>se connecter.</b></Link>
      </div>
    </div>
  );
} 