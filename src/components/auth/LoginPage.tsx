'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "@/styles/Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        toast.error('Email ou mot de passe incorrect', {
          position: "top-right",
          autoClose: 3000,
        });
        setError('Email ou mot de passe incorrect');
      } else {
        toast.success('Connexion réussie !', {
          position: "top-right",
          autoClose: 2000,
        });
        router.push('/dashboard');
        router.refresh();
      }
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
      
      <div className={styles.formContainer}>
        <h1 className={styles.title}>
          Me <span className={styles.highlight}>connecter</span>
        </h1>
        <div className={styles.subtitle}>
          <b>Plus de 300 mentors</b> vous attendent
        </div>
        {error && <p className={styles.error}>{error}</p>}
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
              placeholder="Entrez votre mot de passe ici"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn}>Se connecter</button>
        </form>
        <div className={styles.signup}>
          <span>Je n&apos;ai pas de compte, </span>
          <Link href="/auth/signup" className={styles.signupLink}>s&apos;inscrire</Link>
        </div>
      </div>
    </div>
  );
}
