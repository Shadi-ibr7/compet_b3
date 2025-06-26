'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/Payment.module.css';

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!session?.user?.id) {
      setError('Utilisateur non authentifié');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du traitement du paiement');
      }

      setSuccess(true);
      
      // Rediriger vers le dashboard après 3 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (err) {
      console.error('Erreur paiement:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✅</div>
            <h1>Paiement réussi !</h1>
            <p>Votre compte a été mis à niveau vers Molty Premium.</p>
            <p>Redirection vers votre dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <button 
            onClick={() => router.back()} 
            className={styles.backButton}
          >
            <Image src="/arrow-left.svg" width={20} height={20} alt="Retour" />
            Retour
          </button>
        </div>

        <div className={styles.paymentCard}>
          <div className={styles.logoSection}>
            <Image 
              src="/molty_logo.svg" 
              width={60} 
              height={60} 
              alt="Molty Logo" 
              className={styles.logo}
            />
            <h1>Molty Premium</h1>
          </div>

          <div className={styles.pricingSection}>
            <div className={styles.price}>
              <span className={styles.currency}>€</span>
              <span className={styles.amount}>9</span>
              <span className={styles.period}>/mois</span>
            </div>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.checkmark}>✓</span>
                <span>Accès à tous les mentors</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.checkmark}>✓</span>
                <span>Messages illimités</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.checkmark}>✓</span>
                <span>Profil mis en avant</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.checkmark}>✓</span>
                <span>Support prioritaire</span>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className={styles.payButton}
          >
            {isProcessing ? (
              <>
                <div className={styles.spinner}></div>
                Traitement en cours...
              </>
            ) : (
              'Payer maintenant'
            )}
          </button>

          <p className={styles.disclaimer}>
            * Ceci est un système de paiement fictif à des fins de démonstration.
          </p>
        </div>
      </div>
    </div>
  );
}