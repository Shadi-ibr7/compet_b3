"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/AnnonceForm.module.css';
import type { IAnnonce } from '@/types/interfaces/annonce.interface';
import { getAnnonceTypesByCategory } from '@/types/enums/annonce-types.enum';
import FormattedTextArea from '@/components/Editor/FormattedTextArea';

interface AnnonceFormProps {
  initialData?: IAnnonce;
  onSubmit: (data: Partial<IAnnonce>) => Promise<void>;
}

export default function AnnonceForm({ initialData, onSubmit }: AnnonceFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [type, setType] = useState(initialData?.type || '');
  const [nomEtablissement, setNomEtablissement] = useState(initialData?.nomEtablissement || '');
  const [nomMetier, setNomMetier] = useState(initialData?.nomMetier || '');
  const [localisation, setLocalisation] = useState(initialData?.localisation || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [ceQueJePropose, setCeQueJePropose] = useState(initialData?.ceQueJePropose || '');
  const [profilRecherche, setProfilRecherche] = useState(initialData?.profilRecherche || '');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement de l\'image');
      }

      const { url } = await response.json();
      setImageUrl(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      setError('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!session?.user?.id) {
        throw new Error('Vous devez être connecté');
      }

      if (session.user.role !== 'mentor') {
        throw new Error('Vous devez être mentor pour créer une annonce');
      }

      if (!type || !nomEtablissement || !nomMetier || !description || !localisation) {
        throw new Error('Tous les champs obligatoires doivent être remplis');
      }

      await onSubmit({
        type,
        nomEtablissement,
        nomMetier,
        localisation,
        description,
        imageUrl,
        ceQueJePropose,
        profilRecherche,
        date: new Date(),
        mentorId: session.user.id
      });

      router.push('/dashboard');
    } catch (err: unknown) {
      console.error('Erreur lors de la soumission:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>
          {initialData ? 'Modifier l\'annonce' : 'Créer votre annonce'}
        </h1>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Informations générales</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>
              Type d'opportunité *
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={styles.select}
              required
              disabled={isLoading}
            >
              <option value="">Sélectionnez un type</option>
              {Object.entries(getAnnonceTypesByCategory()).map(([category, types]) => (
                <optgroup key={category} label={category}>
                  {types.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nomEtablissement" className={styles.label}>
              Nom de l'établissement *
            </label>
            <input
              type="text"
              id="nomEtablissement"
              value={nomEtablissement}
              onChange={(e) => setNomEtablissement(e.target.value)}
              className={styles.input}
              placeholder="Ex: École de Commerce de Paris"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nomMetier" className={styles.label}>
              Nom du métier *
            </label>
            <input
              type="text"
              id="nomMetier"
              value={nomMetier}
              onChange={(e) => setNomMetier(e.target.value)}
              className={styles.input}
              placeholder="Ex: Développeur Full Stack"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="localisation" className={styles.label}>
              Localisation *
            </label>
            <input
              type="text"
              id="localisation"
              value={localisation}
              onChange={(e) => setLocalisation(e.target.value)}
              className={styles.input}
              placeholder="Ex: Paris, France"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contenu de l'annonce</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description *
            </label>
            <FormattedTextArea
              value={description}
              onChange={setDescription}
              placeholder="Décrivez votre expertise et ce que vous pouvez apporter..."
              readOnly={isLoading}
              fieldName="description"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ceQueJePropose" className={styles.label}>
              Ce que je propose (optionnel)
            </label>
            <FormattedTextArea
              value={ceQueJePropose}
              onChange={setCeQueJePropose}
              placeholder="Décrivez concrètement ce que vous proposez : accompagnement, ressources, méthodes..."
              readOnly={isLoading}
              fieldName="ceQueJePropose"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="profilRecherche" className={styles.label}>
              Profil recherché (optionnel)
            </label>
            <FormattedTextArea
              value={profilRecherche}
              onChange={setProfilRecherche}
              placeholder="Décrivez le profil idéal : niveau d'études, expérience, motivation, objectifs..."
              readOnly={isLoading}
              fieldName="profilRecherche"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Image (optionnel)</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>
              Ajouter une image
            </label>
            <div className={styles.uploadArea}>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.hiddenInput}
                disabled={isLoading || isUploading}
              />
              <label htmlFor="image" className={`${styles.uploadButton} ${(isLoading || isUploading) ? styles.disabled : ''}`}>
                <Image src="/upload.svg" width={20} height={20} alt="" />
                <span>{isUploading ? 'Téléchargement...' : 'Choisir une image'}</span>
              </label>
              
              {imageUrl && (
                <div className={styles.preview}>
                  <Image
                    src={imageUrl}
                    alt="Aperçu"
                    width={200}
                    height={120}
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>
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
            disabled={isLoading || isUploading}
            className={styles.primaryButton}
          >
            {isLoading ? 'Envoi...' : initialData ? 'Mettre à jour' : 'Créer l\'annonce'}
          </button>
        </div>
      </form>
    </div>
  );
}
