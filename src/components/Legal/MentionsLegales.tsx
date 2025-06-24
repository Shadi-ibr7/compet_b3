"use client";
import React from 'react';
import styles from '@/styles/Legal.module.css';

const MentionsLegales = () => {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalContent}>
        <header className={styles.legalHeader}>
          <h1 className={styles.legalTitle}>Mentions Légales</h1>
          <p className={styles.legalSubtitle}>Informations légales obligatoires</p>
        </header>

        <div className={styles.legalBody}>
          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>1. Éditeur du site</h2>
            <div className={styles.definitionsList}>
              <div className={styles.definition}>
                <strong>Dénomination sociale :</strong> Molty SAS
              </div>
              <div className={styles.definition}>
                <strong>Forme juridique :</strong> Société par Actions Simplifiée
              </div>
              <div className={styles.definition}>
                <strong>Capital social :</strong> 10 000 euros
              </div>
              <div className={styles.definition}>
                <strong>RCS :</strong> Paris 123 456 789
              </div>
              <div className={styles.definition}>
                <strong>SIRET :</strong> 123 456 789 00010
              </div>
              <div className={styles.definition}>
                <strong>TVA Intracommunautaire :</strong> FR12345678900
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>2. Siège social</h2>
            <p className={styles.sectionText}>
              Molty SAS<br />
              42 Avenue de l'Innovation<br />
              75001 Paris, France
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>3. Contact</h2>
            <div className={styles.definitionsList}>
              <div className={styles.definition}>
                <strong>Email :</strong> contact@molty.fr
              </div>
              <div className={styles.definition}>
                <strong>Téléphone :</strong> +33 1 23 45 67 89
              </div>
              <div className={styles.definition}>
                <strong>Support :</strong> support@molty.fr
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>4. Directeur de publication</h2>
            <p className={styles.sectionText}>
              Le directeur de publication est Monsieur Jean Dupont, 
              Président de Molty SAS, domicilié au siège social de la société.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>5. Hébergement</h2>
            <div className={styles.definitionsList}>
              <div className={styles.definition}>
                <strong>Hébergeur :</strong> Vercel Inc.
              </div>
              <div className={styles.definition}>
                <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
              </div>
              <div className={styles.definition}>
                <strong>Site web :</strong> vercel.com
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>6. Propriété intellectuelle</h2>
            <p className={styles.sectionText}>
              L'ensemble du contenu présent sur le site molty.fr (textes, images, vidéos, logos, icônes, sons, logiciels) 
              est la propriété exclusive de Molty SAS, à l'exception des contenus appartenant à des tiers partenaires 
              ayant autorisé Molty SAS à les utiliser.
            </p>
            <p className={styles.sectionText}>
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments 
              du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Molty SAS.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>7. Protection des données personnelles</h2>
            <p className={styles.sectionText}>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
              vous disposez de droits sur vos données personnelles. Pour plus d'informations, consultez notre 
              <a href="/legal/cookies" className={styles.contactEmail}>Politique de cookies</a>.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>8. Responsabilité</h2>
            <p className={styles.sectionText}>
              Molty SAS met tout en œuvre pour offrir aux utilisateurs des informations et/ou des outils disponibles 
              et vérifiés, mais ne saurait être tenue pour responsable des erreurs, d'une absence de disponibilité 
              des informations et/ou de la présence de virus sur son site.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>9. Droit applicable</h2>
            <p className={styles.sectionText}>
              Le présent site et les présentes mentions légales sont régis par le droit français. 
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;