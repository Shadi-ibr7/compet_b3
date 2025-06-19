"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { IAnnonce } from '@/types/interfaces/annonce.interface';

interface AnnonceFormProps {
  initialData?: IAnnonce;
  onSubmit: (data: Partial<IAnnonce>) => Promise<void>;
}

export default function AnnonceForm({ initialData, onSubmit }: AnnonceFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [localisation, setLocalisation] = useState(initialData?.localisation || '');
  const [description, setDescription] = useState(initialData?.description || '');

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

      await onSubmit({
        localisation,
        description,
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
        <label htmlFor="localisation" className="block text-sm font-medium text-gray-700">
          Localisation
        </label>
        <input
          type="text"
          id="localisation"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Envoi...' : initialData ? 'Mettre à jour' : 'Créer l\'annonce'}
        </button>
      </div>
    </form>
  );
}
