'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Register.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSafeInput } from "@/hooks/useSafeInput";
import RegisterStepTwo from "./RegisterStepTwo";

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState<"molt" | "mentor">("molt");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form state sécurisé avec useSafeInput
  const name = useSafeInput({ fieldType: "name", initialValue: "", required: true });
  const email = useSafeInput({ fieldType: "email", initialValue: "", required: true });
  const password = useSafeInput({ fieldType: "password", initialValue: "", required: true });

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Validation des champs
      if (!name.isValid || !email.isValid || !password.isValid) {
        throw new Error("Veuillez corriger les erreurs dans le formulaire");
      }
      
      if (password.value.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }
      
      setCurrentStep(2);
    } catch (err) {
      console.error("Erreur lors de la première étape:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleStepTwo = async (data: { city: string; role: "molt" | "mentor" }) => {
    setError("");
    setIsLoading(true);

    try {
      // On utilise les champs supportés par le backend
      const result = await signIn("credentials", {
        email: email.value,
        password: password.value,
        name: name.value,
        city: data.city,
        role: data.role,
        isSignup: "true",
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

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
      
      <div className={styles.formContainer}>
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
              value={name.value}
              onChange={name.handleChange}
              required
            />
            {name.error && <span className={styles.fieldError}>{name.error}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Mail</label>
            <input 
              className={styles.input} 
              type="email" 
              placeholder="Entrez votre mail ici" 
              value={email.value}
              onChange={email.handleChange}
              required
            />
            {email.error && <span className={styles.fieldError}>{email.error}</span>}
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Mot de passe</label>
            <input 
              className={styles.input} 
              type="password" 
              placeholder="Entrez votre mot de passe ici" 
              value={password.value}
              onChange={password.handleChange}
              required
            />
            {password.error && <span className={styles.fieldError}>{password.error}</span>}
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
    </div>
  );
} 