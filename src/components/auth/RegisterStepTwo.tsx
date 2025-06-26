'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Register.module.css";

interface RegisterStepTwoProps {
  onSubmit: (data: {
    address: string;
    city: string;
    role: "molt" | "mentor";
  }) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export default function RegisterStepTwo({ onSubmit, isLoading, error }: RegisterStepTwoProps) {
  // Form state sécurisé avec useSafeInput
  const address = useSafeInput("", "address");
  const city = useSafeInput("", "city");
  const [role, setRole] = useState<"molt" | "mentor">("molt");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      address: address.value,
      city: city.value,
      role,
    });
  };

  return (
    <div className={styles.container}>
      <Link href="/">
        <Image className={styles.logo} width={85.5} height={40} alt="Molty" src="/Logotype.svg" />
      </Link>
      
      <div className={styles.formContainer}>
        <h1 className={styles.title}>
          M&apos; <span className={styles.highlight}>inscrire</span>
        </h1>
        <div className={styles.subtitle}>
          <b>Plus de 300 mentors</b> vous attendent
        </div>
        <div className={styles.stepIndicator}>
          <div className={styles.step}></div>
          <div className={`${styles.step} ${styles.stepActive}`}></div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Adresse</label>
            <input 
              className={styles.input} 
              type="text" 
              placeholder="Entrez votre adresse ici" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Ville</label>
            <input 
              className={styles.input} 
              type="text" 
              placeholder="Entrez votre ville ici" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Je souhaite m&apos;inscrire en tant que :</label>
            <select
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value as "molt" | "mentor")}
              disabled={isLoading}
              required
            >
              <option value="molt">Utilisateur normal - Je cherche un mentor</option>
              <option value="mentor">Mentor - Je souhaite accompagner d&apos;autres personnes</option>
            </select>
          </div>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
} 