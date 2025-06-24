"use client";
import React, { useState } from 'react';
import styles from '@/styles/Legal.module.css';

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    partnerOffers: false,
    profileVisibility: 'public',
    dataSharing: false,
    analytics: true,
    personalization: true
  });

  const [saved, setSaved] = useState(false);

  const handleCheckboxChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Préférences sauvegardées:', preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalContent}>
        <header className={styles.legalHeader}>
          <h1 className={styles.legalTitle}>Gérer mes préférences</h1>
          <p className={styles.legalSubtitle}>Personnalisez votre expérience Molty selon vos préférences</p>
        </header>

        <div className={styles.legalBody}>
          {saved && (
            <div className={styles.successMessage}>
              ✅ Vos préférences ont été sauvegardées avec succès !
            </div>
          )}

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>1. Notifications</h2>
            <p className={styles.sectionText}>
              Choisissez comment vous souhaitez être informé des activités sur votre compte.
            </p>
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className={styles.checkbox}
                  checked={preferences.emailNotifications}
                  onChange={() => handleCheckboxChange('emailNotifications')}
                />
                <label htmlFor="emailNotifications" className={styles.checkboxLabel}>
                  <strong>Notifications par email</strong><br />
                  Recevoir les notifications importantes par email (nouveaux messages, mises à jour de profil)
                </label>
              </div>
              
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="smsNotifications"
                  className={styles.checkbox}
                  checked={preferences.smsNotifications}
                  onChange={() => handleCheckboxChange('smsNotifications')}
                />
                <label htmlFor="smsNotifications" className={styles.checkboxLabel}>
                  <strong>Notifications par SMS</strong><br />
                  Recevoir les notifications urgentes par SMS
                </label>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>2. Communications marketing</h2>
            <p className={styles.sectionText}>
              Gérez vos préférences concernant nos communications commerciales.
            </p>
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="marketingEmails"
                  className={styles.checkbox}
                  checked={preferences.marketingEmails}
                  onChange={() => handleCheckboxChange('marketingEmails')}
                />
                <label htmlFor="marketingEmails" className={styles.checkboxLabel}>
                  <strong>Newsletter Molty</strong><br />
                  Recevoir notre newsletter avec les dernières actualités et conseils
                </label>
              </div>
              
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="partnerOffers"
                  className={styles.checkbox}
                  checked={preferences.partnerOffers}
                  onChange={() => handleCheckboxChange('partnerOffers')}
                />
                <label htmlFor="partnerOffers" className={styles.checkboxLabel}>
                  <strong>Offres partenaires</strong><br />
                  Recevoir les offres spéciales de nos partenaires
                </label>
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>3. Visibilité du profil</h2>
            <p className={styles.sectionText}>
              Contrôlez qui peut voir votre profil sur la plateforme.
            </p>
            <div className={styles.formGroup}>
              <label htmlFor="profileVisibility" className={styles.formLabel}>
                Visibilité de mon profil :
              </label>
              <select
                id="profileVisibility"
                className={styles.formSelect}
                value={preferences.profileVisibility}
                onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
              >
                <option value="public">Public - Visible par tous les utilisateurs</option>
                <option value="members">Membres seulement - Visible par les utilisateurs connectés</option>
                <option value="private">Privé - Invisible dans les recherches</option>
              </select>
            </div>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>4. Données et confidentialité</h2>
            <p className={styles.sectionText}>
              Gérez l'utilisation de vos données pour améliorer votre expérience.
            </p>
            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="dataSharing"
                  className={styles.checkbox}
                  checked={preferences.dataSharing}
                  onChange={() => handleCheckboxChange('dataSharing')}
                />
                <label htmlFor="dataSharing" className={styles.checkboxLabel}>
                  <strong>Partage de données anonymisées</strong><br />
                  Autoriser l'utilisation de mes données anonymisées pour améliorer la plateforme
                </label>
              </div>
              
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="analytics"
                  className={styles.checkbox}
                  checked={preferences.analytics}
                  onChange={() => handleCheckboxChange('analytics')}
                />
                <label htmlFor="analytics" className={styles.checkboxLabel}>
                  <strong>Analytics et statistiques</strong><br />
                  Permettre la collecte de données d'usage pour améliorer nos services
                </label>
              </div>
              
              <div className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  id="personalization"
                  className={styles.checkbox}
                  checked={preferences.personalization}
                  onChange={() => handleCheckboxChange('personalization')}
                />
                <label htmlFor="personalization" className={styles.checkboxLabel}>
                  <strong>Personnalisation</strong><br />
                  Utiliser mes données pour personnaliser mon expérience et mes recommandations
                </label>
              </div>
            </div>
          </section>

          <div className={styles.formContainer}>
            <button onClick={handleSave} className={styles.submitButton}>
              💾 Sauvegarder mes préférences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;