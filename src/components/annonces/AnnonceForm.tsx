"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { IAnnonce } from '@/types/interfaces/annonce.interface';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type de mentorat *
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={isLoading}
        >
          <option value="">Sélectionnez un type</option>
          <option value="Professionnel">Professionnel</option>
          <option value="Académique">Académique</option>
          <option value="Entrepreneuriat">Entrepreneuriat</option>
          <option value="Carrière">Carrière</option>
          <option value="Développement personnel">Développement personnel</option>
        </select>
      </div>

      <div>
        <label htmlFor="nomEtablissement" className="block text-sm font-medium text-gray-700">
          Nom de l'établissement *
        </label>
        <input
          type="text"
          id="nomEtablissement"
          value={nomEtablissement}
          onChange={(e) => setNomEtablissement(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Ex: École de Commerce de Paris"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="nomMetier" className="block text-sm font-medium text-gray-700">
          Nom du métier *
        </label>
        <input
          type="text"
          id="nomMetier"
          value={nomMetier}
          onChange={(e) => setNomMetier(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Ex: Développeur Full Stack"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="localisation" className="block text-sm font-medium text-gray-700">
          Localisation *
        </label>
        <input
          type="text"
          id="localisation"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Ex: Paris, France"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Décrivez votre expertise et ce que vous pouvez apporter..."
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image (optionnel)
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          disabled={isLoading || isUploading}
        />
        {isUploading && (
          <p className="mt-2 text-sm text-gray-500">Téléchargement en cours...</p>
        )}
        {imageUrl && (
          <div className="mt-2">
            <Image
              src={imageUrl}
              alt="Aperçu"
              width={200}
              height={120}
              className="rounded-md object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Envoi...' : initialData ? 'Mettre à jour' : 'Créer l\'annonce'}
        </button>
      </div>
    </form>
  );
}
