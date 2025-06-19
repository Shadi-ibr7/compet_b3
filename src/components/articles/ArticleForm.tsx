"use client";

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { IArticle } from '@/types/interfaces/article.interface';

interface ArticleFormProps {
  initialData?: IArticle;
  onSubmit: (data: Partial<IArticle>) => Promise<void>;
}

export default function ArticleForm({ initialData, onSubmit }: ArticleFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [auteur, setAuteur] = useState(initialData?.auteur || '');
  const [metaTitle, setMetaTitle] = useState(initialData?.meta?.title || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.meta?.description || '');
  const [metaKeywords, setMetaKeywords] = useState(initialData?.meta?.keywords?.join(', ') || '');
  
  // File inputs
  const [podcastFile, setPodcastFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentPodcastUrl] = useState(initialData?.lienPodcast || '');
  const [currentImageUrl] = useState(initialData?.imageUrl || '');
  
  // Refs pour réinitialiser les input file
  const podcastInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
    return <div className="p-4">Accès non autorisé</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contenu</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Auteur</label>
        <input
          type="text"
          value={auteur}
          onChange={(e) => setAuteur(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image de couverture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          ref={imageInputRef}
          className="mt-1 block w-full"
        />
        {currentImageUrl && (
          <div className="mt-2">
            <Image src={currentImageUrl} alt="Preview" width={128} height={128} className="h-32 w-auto object-cover rounded" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fichier Podcast (optionnel)</label>
        <input
          type="file"
          accept=".mp3,.wav,.m4a,.aac,.ogg"
          onChange={(e) => setPodcastFile(e.target.files?.[0] || null)}
          ref={podcastInputRef}
          className="mt-1 block w-full"
        />
        {currentPodcastUrl && (
          <div className="mt-2">
            <audio controls src={currentPodcastUrl} className="w-full" />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Meta données</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Title</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mots-clés (séparés par des virgules)
          </label>
          <input
            type="text"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
