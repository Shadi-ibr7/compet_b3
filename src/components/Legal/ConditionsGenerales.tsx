"use client";
import React from 'react';
import styles from '@/styles/Legal.module.css';

const ConditionsGenerales = () => {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalContent}>
        <header className={styles.legalHeader}>
          <h1 className={styles.legalTitle}>Conditions Générales d'Utilisation</h1>
          <p className={styles.legalSubtitle}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </header>

        <div className={styles.legalBody}>
          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>1. Objet et champ d'application</h2>
            <p className={styles.sectionText}>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Molty, 
              un service en ligne permettant de mettre en relation des entrepreneurs du commerce de proximité avec des mentors expérimentés. 
              En utilisant nos services, vous acceptez sans réserve les présentes conditions.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>2. Définitions</h2>
            <div className={styles.definitionsList}>
              <div className={styles.definition}>
                <strong>Plateforme :</strong> Le site web et l'application mobile Molty accessible à l'adresse molty.fr
              </div>
              <div className={styles.definition}>
                <strong>Utilisateur :</strong> Toute personne physique ou morale utilisant la plateforme
              </div>
              <div className={styles.definition}>
                <strong>Mentor :</strong> Professionnel expérimenté proposant ses services d'accompagnement
              </div>
              <div className={styles.definition}>
                <strong>Porteur de projet :</strong> Entrepreneur souhaitant être accompagné dans son projet
              </div>
            </div>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>3. Inscription et compte utilisateur</h2>
            <p className={styles.sectionText}>
              L'inscription sur la plateforme est gratuite et ouverte à toute personne majeure. 
              Vous vous engagez à fournir des informations exactes et à maintenir votre profil à jour. 
              Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>4. Services proposés</h2>
            <p className={styles.sectionText}>
              Molty propose une plateforme de mise en relation entre mentors et porteurs de projets dans le commerce de proximité. 
              Nos services incluent :
            </p>
            <ul className={styles.servicesList}>
              <li>Création et consultation de profils de mentors</li>
              <li>Publication et consultation d'annonces</li>
              <li>Système de messagerie intégrée</li>
              <li>Outils d'accompagnement et ressources documentaires</li>
              <li>Blog et contenus éditoriaux</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>5. Obligations des utilisateurs</h2>
            <p className={styles.sectionText}>
              En utilisant la plateforme, vous vous engagez à :
            </p>
            <ul className={styles.obligationsList}>
              <li>Respecter les lois et règlements en vigueur</li>
              <li>Ne pas publier de contenus illicites, diffamatoires ou trompeurs</li>
              <li>Maintenir un comportement respectueux envers les autres utilisateurs</li>
              <li>Ne pas utiliser la plateforme à des fins commerciales non autorisées</li>
              <li>Protéger vos identifiants de connexion</li>
            </ul>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>6. Responsabilité</h2>
            <p className={styles.sectionText}>
              Molty agit en qualité d'intermédiaire technique facilitant la mise en relation. 
              Nous ne sommes pas responsables des relations contractuelles qui peuvent naître entre utilisateurs. 
              Chaque utilisateur est responsable de ses propres actions et décisions.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>7. Propriété intellectuelle</h2>
            <p className={styles.sectionText}>
              Tous les éléments de la plateforme (textes, images, logos, marques) sont protégés par le droit de la propriété intellectuelle. 
              Toute reproduction ou utilisation non autorisée est strictement interdite.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>8. Modification des CGU</h2>
            <p className={styles.sectionText}>
              Molty se réserve le droit de modifier les présentes CGU à tout moment. 
              Les utilisateurs seront informés de toute modification substantielle par email ou notification sur la plateforme.
            </p>
          </section>

          <section className={styles.legalSection}>
            <h2 className={styles.sectionTitle}>9. Contact</h2>
            <p className={styles.sectionText}>
              Pour toute question concernant ces conditions générales, vous pouvez nous contacter à l'adresse : 
              <span className={styles.contactEmail}>contact@molty.fr</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ConditionsGenerales;