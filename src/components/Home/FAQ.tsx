"use client";
import React from "react";
import { useState } from "react";
import styles from "@/styles/FAQ.module.css";

const faqs = [
  {
    question: "Pourquoi choisir Molty pour mon projet ?",
    answer: "Molty vous accompagne pour que votre projet ne reste pas un rêve. Avec plus de 300 mentors disponibles, vous n'êtes jamais seul !"
  },
  {
    question: "Comment fonctionne l'accompagnement ?",
    answer: "Vous êtes mis en relation avec un mentor qui vous guide à chaque étape, du projet à l'ouverture."
  },
  {
    question: "Combien coûte l'accompagnement ?",
    answer: "L'accompagnement est gratuit pour les porteurs de projet. Notre mission : soutenir l'entrepreneuriat local !"
  },
  {
    question: "Puis-je devenir mentor ?",
    answer: "Oui, si vous avez de l'expérience dans le commerce de proximité et l'envie de transmettre, contactez-nous !"
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.faqSection}>
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
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 