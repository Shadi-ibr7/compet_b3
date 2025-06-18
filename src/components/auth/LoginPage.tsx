import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Link href="/">
        <Image className={styles.logo} width={85.5} height={40} alt="Molty" src="/Logotype.svg" />
      </Link>
      <h1 className={styles.title}>
        Me <span className={styles.highlight}>connecter</span>
      </h1>
      <div className={styles.subtitle}>
        <b>Plus de 300 mentors</b> vous attendent
      </div>
      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mail</label>
          <input className={styles.input} type="email" placeholder="Entrez votre mail ici" />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mot de passe</label>
          <input className={styles.input} type="password" placeholder="Entrez votre mot de passe ici" />
        </div>
        <button type="submit" className={styles.submitBtn}>Se connecter</button>
      </form>
      <div className={styles.signup}>
        <span>Je n&apos;ai pas de compte, </span>
        <b className={styles.signupLink}>s&apos;inscrire.</b>
      </div>
    </div>
  );
}
