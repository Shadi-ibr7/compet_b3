'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "@/styles/Login.module.css";

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas', {
        position: "top-right",
        autoClose: 3000,
      });
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Une erreur est survenue', {
          position: "top-right",
          autoClose: 3000,
        });
        setError(data.message || 'Une erreur est survenue');
        return;
      }

      toast.success('Inscription réussie !', {
        position: "top-right",
        autoClose: 2000,
      });
      router.push('/auth/signin');
    } catch (err) {
      toast.error('Une erreur est survenue', {
        position: "top-right",
        autoClose: 3000,
      });
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/">
        <Image className={styles.logo} width={85.5} height={40} alt="Molty" src="/Logotype.svg" />
      </Link>
      <h1 className={styles.title}>
        M&apos;<span className={styles.highlight}>inscrire</span>
      </h1>
      <div className={styles.subtitle}>
        Rejoignez notre communauté de mentors
      </div>
      <p className={styles.error}>{error}</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mail</label>
          <input 
            className={styles.input} 
            type="email" 
            placeholder="Entrez votre mail ici"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Mot de passe</label>
          <input 
            className={styles.input} 
            type="password" 
            placeholder="Créez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Confirmer le mot de passe</label>
          <input 
            className={styles.input} 
            type="password" 
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn}>S&apos;inscrire</button>
      </form>
      <div className={styles.signup}>
        <span>J&apos;ai déjà un compte, </span>
        <Link href="/auth/signin" className={styles.signupLink}>me connecter</Link>
      </div>
    </div>
  );
}
