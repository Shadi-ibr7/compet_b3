"use client";
import React, { useState } from 'react';
import styles from '@/styles/Legal.module.css';

const Cookies = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
    preferences: true,
    social: false
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof cookieSettings) => {
    if (key === 'necessary') return;
    
    setCookieSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    console.log('Paramètres cookies sauvegardés:', cookieSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const acceptAll = () => {
    setCookieSettings({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      social: true
    });
  };

  const rejectAll = () => {
    setCookieSettings({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      social: false
    });
  };

  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalContent}>
        <header className={styles.legalHeader}>
          <h1 className={styles.legalTitle}>Politique de Cookies</h1>
          <p className={styles.legalSubtitle}>Gérez vos préférences de cookies et découvrez comment nous les utilisons</p>
        </header>

        <div className={styles.legalBody}>
          {saved && (
            <div className={styles.successMessage}>
              🍪 Vos préférences de cookies ont été sauvegardées !
            </div>
          )}

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>Qu'est-ce qu'un cookie ?</h2>
            <p className={styles.sectionText}>
              Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site web. 
              Ils nous aident à améliorer votre expérience de navigation, à analyser l'utilisation du site et à 
              personnaliser le contenu selon vos préférences.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>Types de cookies que nous utilisons</h2>
            
            <div className={styles.cookieTypes}>
              <div className={styles.cookieType}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 className={styles.cookieTypeTitle}>🔒 Cookies nécessaires</h3>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={cookieSettings.necessary}
                      disabled={true}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <p className={styles.cookieTypeDesc}>
                  Ces cookies sont essentiels au fonctionnement du site. Ils permettent la navigation, 
                  l'authentification et l'accès aux zones sécurisées. Ils ne peuvent pas être désactivés.
                </p>
              </div>

              <div className={styles.cookieType}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 className={styles.cookieTypeTitle}>📊 Cookies d'analyse</h3>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={cookieSettings.analytics}
                      onChange={() => handleToggle('analytics')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <p className={styles.cookieTypeDesc}>
                  Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site. 
                  Toutes les informations collectées sont anonymes et nous aident à améliorer nos services.
                </p>
              </div>

              <div className={styles.cookieType}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 className={styles.cookieTypeTitle}>🎯 Cookies marketing</h3>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={cookieSettings.marketing}
                      onChange={() => handleToggle('marketing')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <p className={styles.cookieTypeDesc}>
                  Ces cookies sont utilisés pour afficher des publicités pertinentes et personnalisées. 
                  Ils permettent également de mesurer l'efficacité de nos campagnes publicitaires.
                </p>
              </div>

              <div className={styles.cookieType}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 className={styles.cookieTypeTitle}>⚙️ Cookies de préférences</h3>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={cookieSettings.preferences}
                      onChange={() => handleToggle('preferences')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <p className={styles.cookieTypeDesc}>
                  Ces cookies permettent au site de mémoriser vos préférences (langue, région, paramètres d'affichage) 
                  pour vous offrir une expérience personnalisée.
                </p>
              </div>

              <div className={styles.cookieType}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 className={styles.cookieTypeTitle}>👥 Cookies sociaux</h3>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={cookieSettings.social}
                      onChange={() => handleToggle('social')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <p className={styles.cookieTypeDesc}>
                  Ces cookies permettent de partager du contenu sur les réseaux sociaux et de mesurer 
                  l'efficacité de nos publications sur ces plateformes.
                </p>
              </div>
            </div>
          </section>

          <div className={styles.formContainer}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={acceptAll} className={styles.submitButton} style={{ flex: 1, minWidth: '200px' }}>
                ✅ Accepter tous les cookies
              </button>
              <button 
                onClick={rejectAll} 
                className={styles.submitButton} 
                style={{ flex: 1, minWidth: '200px', background: '#e5e7eb', color: '#06104a' }}
              >
                ❌ Refuser les cookies optionnels
              </button>
            </div>
            <button onClick={handleSave} className={styles.submitButton} style={{ marginTop: '12px' }}>
              💾 Sauvegarder mes préférences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;