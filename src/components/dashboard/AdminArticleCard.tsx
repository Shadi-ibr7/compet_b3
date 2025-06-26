'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { IArticle } from '@/types/interfaces/article.interface';
import styles from '@/styles/AdminDashboard.module.css';

interface AdminArticleCardProps {
  article: IArticle;
  onDelete: (id: string) => Promise<void>;
}

export default function AdminArticleCard({ article, onDelete }: AdminArticleCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!article.id) return;
    
    setIsDeleting(true);
    try {
      await onDelete(article.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'article');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModify = () => {
    if (article.id) {
      router.push(`/articles/${article.id}/edit`);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const stripHtmlAndTruncate = (html: string, maxLength: number) => {
    // Supprimer les balises HTML
    const textOnly = html.replace(/<[^>]*>/g, '');
    // Décoder les entités HTML
    const decodedText = textOnly
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    if (decodedText.length <= maxLength) return decodedText;
    return decodedText.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className={styles.articleCard}>
        <div className={styles.articleHeader}>
          <div>
            <h3>{truncateText(article.title, 60)}</h3>
            <span className={styles.articleAuthor}>Par {article.auteur}</span>
          </div>
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleModify}
              className={styles.modifyButton}
              title="Modifier l'article"
            >
              Modifier
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className={styles.deleteButton}
              disabled={isDeleting}
              title="Supprimer l'article"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </div>
        
        <div className={styles.articleContent}>
          {article.imageUrl && (
            <div className={styles.articleImageContainer}>
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={150}
                height={100}
                className={styles.articleImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder_article.png';
                }}
              />
            </div>
          )}
          
          <div className={styles.articleDetails}>
            {article.content && (
              <p className={styles.articleDescription}>
                {stripHtmlAndTruncate(article.content, 150)}
              </p>
            )}
            
            <div className={styles.articleMeta}>
              <span className={styles.articleDate}>
                📅 {formatDate(article.date)}
              </span>
              {article.lienPodcast && (
                <span className={styles.articlePodcast}>
                  🎵 Podcast disponible
                </span>
              )}
            </div>
            
            {article.meta && (
              <div className={styles.seoInfo}>
                <div className={styles.seoItem}>
                  <span className={styles.seoLabel}>Meta titre:</span>
                  <span>{truncateText(article.meta.title || '', 50)}</span>
                </div>
                {article.meta.keywords && article.meta.keywords.length > 0 && (
                  <div className={styles.seoItem}>
                    <span className={styles.seoLabel}>Mots-clés:</span>
                    <span>{article.meta.keywords.slice(0, 3).join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Confirmer la suppression</h3>
            <p>
              Êtes-vous sûr de vouloir supprimer l'article "<strong>{article.title}</strong>" ?
            </p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
              Cette action est irréversible et supprimera définitivement l'article.
            </p>
            <div className={styles.modalButtons}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className={styles.confirmDeleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}