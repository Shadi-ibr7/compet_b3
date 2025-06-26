'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AnnonceForm from '@/components/annonces/AnnonceForm';
import type { IAnnonce } from '@/types/interfaces/annonce.interface';

export default function NewAnnoncePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkExistingAnnonce = async () => {
    try {
      const response = await fetch(`/api/annonces/mentor/${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          // Le mentor a déjà une annonce, le rediriger vers le dashboard
          router.push('/dashboard');
          return;
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setError('Erreur lors de la vérification de vos annonces');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      // Vérifier que l'utilisateur est un mentor
      if (session.user.role !== 'mentor') {
        router.push('/dashboard');
        return;
      }

      // Vérifier que le mentor n'a pas déjà une annonce
      checkExistingAnnonce();
    }
  }, [session, status, router]);

  const handleSubmit = async (data: Partial<IAnnonce>) => {
    try {
      const response = await fetch('/api/annonces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de l\'annonce');
      }

      // Rediriger vers le dashboard après création réussie
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur:', error);
      throw error; // Laisser AnnonceForm gérer l'erreur
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'mentor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fefff3] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#06104a]">Créer votre annonce de mentorat</h1>
            <p className="mt-2 text-[#06104a] opacity-70">
              Partagez votre expertise et commencez à accompagner des élèves dans leur parcours.
            </p>
          </div>
          
          <AnnonceForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}