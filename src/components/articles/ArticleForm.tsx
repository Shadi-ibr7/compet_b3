"use client";

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/ArticleForm.module.css';
import type { IArticle } from '@/types/interfaces/article.interface';
import FormattedTextArea from '@/components/Editor/FormattedTextArea';

interface ArticleFormProps {
  initialData?: IArticle;
  onSubmit: (data: Partial<IArticle>) => Promise<void>;
}

export default function ArticleForm({ initialData, onSubmit }: ArticleFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [auteur, setAuteur] = useState(initialData?.auteur || '');
  const [metaTitle, setMetaTitle] = useState(initialData?.meta?.title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.meta?.description || '');
  const [metaKeywords, setMetaKeywords] = useState(initialData?.meta?.keywords?.join(', ') || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [podcastFile, setPodcastFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(initialData?.imageUrl || '');
  const [currentPodcastUrl, setCurrentPodcastUrl] = useState(initialData?.lienPodcast || '');
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const podcastInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!session?.user?.id) {
        throw new Error('Vous devez être connecté');
      }

      // Upload des fichiers si présents
      let podcastUrl = currentPodcastUrl;
      let imageUrl = currentImageUrl;

      if (podcastFile) {
        const formData = new FormData();
        formData.append('file', podcastFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) throw new Error('Erreur lors de l\'upload du podcast');
        const data = await response.json();
        podcastUrl = data.url;
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) throw new Error('Erreur lors de l\'upload de l\'image');
        const data = await response.json();
        imageUrl = data.url;
      }

      if (!imageUrl) {
        throw new Error('Une image est requise pour l\'article');
      }

      const articleData: Partial<IArticle> = {
        title,
        content,
        auteur,
        date: new Date().toISOString(),
        lienPodcast: podcastUrl,
        imageUrl,
        meta: {
          title: metaTitle,
          description: metaDescription,
          keywords: metaKeywords.split(',').map(k => k.trim()).filter(k => k),
        },
        adminId: session.user.id,
      };

      if (initialData?.id) {
        articleData.id = initialData.id;
      }

      await onSubmit(articleData);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (session?.user?.role !== 'admin') {
    return <div className={styles.unauthorized}>Accès non autorisé</div>;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>
          {initialData ? 'Modifier l\'article' : 'Nouvel Article'}
        </h1>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Informations principales</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
              placeholder="Titre de l'article"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Contenu</label>
            <FormattedTextArea
              value={content}
              onChange={setContent}
              placeholder="Rédigez le contenu de votre article..."
              variant="full"
              readOnly={isLoading}
              fieldName="content"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Auteur</label>
            <input
              type="text"
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              required
              className={styles.input}
              placeholder="Nom de l'auteur"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Médias</h2>

          <div className={styles.mediaSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Image de couverture</label>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  ref={imageInputRef}
                  className={styles.hiddenInput}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className={styles.uploadButton}>
                  <Image src="/upload.svg" width={24} height={24} alt="" />
                  <span>Choisir une image</span>
                </label>
                {currentImageUrl && (
                  <div className={styles.preview}>
                    <Image src={currentImageUrl} alt="Preview" width={200} height={200} className={styles.previewImage} />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Fichier Podcast (optionnel)</label>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  accept=".mp3,.wav,.m4a,.aac,.ogg"
                  onChange={(e) => setPodcastFile(e.target.files?.[0] || null)}
                  ref={podcastInputRef}
                  className={styles.hiddenInput}
                  id="podcast-upload"
                />
                <label htmlFor="podcast-upload" className={styles.uploadButton}>
                  <Image src="/upload.svg" width={24} height={24} alt="" />
                  <span>Choisir un podcast</span>
                </label>
                {currentPodcastUrl && (
                  <div className={styles.preview}>
                    <audio controls src={currentPodcastUrl} className={styles.audioPlayer} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>SEO</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className={styles.input}
              placeholder="Titre pour le SEO"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className={styles.textarea}
              rows={3}
              placeholder="Description pour le SEO"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Meta Keywords</label>
            <input
              type="text"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              className={styles.input}
              placeholder="Mots-clés séparés par des virgules"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.secondaryButton}
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}
