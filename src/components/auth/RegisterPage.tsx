'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Register.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import RegisterStepTwo from "./RegisterStepTwo";

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    city: "",
    role: "molt" as "molt" | "mentor"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (formData.password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }
      setCurrentStep(2);
    } catch (err) {
      console.error("Erreur lors de la première étape:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleStepTwo = async (data: { address: string; city: string; role: "molt" | "mentor" }) => {
    setError("");
    setIsLoading(true);

    try {
      // On met à jour les données du formulaire avec les nouvelles informations
      const updatedFormData = {
        ...formData,
        address: data.address,
        city: data.city,
        role: data.role
      };
      setFormData(updatedFormData);

      // On utilise les champs supportés par le backend
      const result = await signIn("credentials", {
        email: updatedFormData.email,
        password: updatedFormData.password,
        name: updatedFormData.name,
        role: updatedFormData.role,
        isSignup: "true",
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Stockage des informations supplémentaires dans le localStorage
      localStorage.setItem('userAdditionalInfo', JSON.stringify({
        address: data.address,
        city: data.city
      }));

      router.push("/dashboard");
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 2) {
    return (
      <RegisterStepTwo
        onSubmit={handleStepTwo}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/">
        <Image className={styles.logo} width={85.5} height={40} alt="Molty" src="/Logotype.svg" />
      </Link>
      <h1 className={styles.title}>
        M&apos; <span className={styles.highlight}>inscrire</span>
      </h1>
      <div className={styles.subtitle}>
        <b>Plus de 300 mentors</b> vous attendent
      </div>
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.stepActive}`}></div>
        <div className={styles.step}></div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <form className={styles.form} onSubmit={handleStepOne}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nom</label>
          <input 
            className={styles.input} 
            type="text" 
            placeholder="Entrez votre nom ici" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mail</label>
          <input 
            className={styles.input} 
            type="email" 
            placeholder="Entrez votre mail ici" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mot de passe</label>
          <input 
            className={styles.input} 
            type="password" 
            placeholder="Entrez votre mot de passe ici" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button 
          type="submit" 
          className={styles.submitBtn}
        >
          Suivant
        </button>
      </form>
      <div className={styles.login}>
        <span>J&apos;ai déjà un compte, </span>
        <Link href="/auth/signin" className={styles.loginLink}>se connecter</Link>
      </div>
    </div>
  );
} 