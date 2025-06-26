"use client";
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import styles from "@/styles/FAQ.module.css";

const faqs = [
  {
    question: "Pourquoi choisir Molty pour mon projet ?",
    answer: "Molty vous connecte avec des mentors expérimentés qui ont réussi dans le commerce de proximité. Notre plateforme vous offre un accompagnement personnalisé et des outils pratiques pour réussir."
  },
  {
    question: "Comment fonctionne l'accompagnement ?",
    answer: "Vous êtes mis en relation avec un mentor qui correspond à votre secteur d'activité. Il vous accompagne étape par étape, du business plan à l'ouverture de votre commerce."
  },
  {
    question: "Combien coûte l'accompagnement ?",
    answer: "Nos tarifs varient selon le niveau d'accompagnement souhaité. Nous proposons des formules adaptées à tous les budgets, avec possibilité de financement."
  },
  {
    question: "Puis-je devenir mentor ?",
    answer: "Oui ! Si vous avez de l'expérience dans le commerce de proximité et souhaitez transmettre vos connaissances, vous pouvez rejoindre notre réseau de mentors."
  },
  {
    question: "Comment créer une annonce ?",
    answer: "Inscrivez-vous sur notre plateforme, complétez votre profil et créez votre annonce en décrivant votre projet. Nos mentors pourront alors vous contacter."
  },
  {
    question: "Combien coûte l'abonnement Premium ?",
    answer: "L'abonnement Premium est à 29€/mois et vous donne accès à des fonctionnalités avancées comme la messagerie illimitée et la priorité dans les mises en relation."
  },
  {
    question: "Comment choisir son mentor ?",
    answer: "Consultez les profils des mentors, leurs spécialités et leurs avis clients. Vous pouvez également utiliser nos filtres pour trouver le mentor qui correspond le mieux à votre projet."
  },
  {
    question: "Y a-t-il un engagement de durée ?",
    answer: "Non, il n'y a aucun engagement de durée. Vous pouvez arrêter l'accompagnement quand vous le souhaitez et reprendre plus tard si nécessaire."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view');
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.faqSection}>
      <h2 className={styles.faqTitle}>FAQ</h2>
      <div className={styles.faqList}>
        {faqs.map((item, i) => (
          <div className={styles.faqItem} key={i}>
            <button 
              className={styles.faqQuestion}
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{item.question}</span>
              <span
                className={`${styles.icon} ${open === i ? styles.open : ""}`}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              className={styles.faqAnswer}
              style={{ display: open === i ? "block" : "none" }}
            >
              <span>{item.answer}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 