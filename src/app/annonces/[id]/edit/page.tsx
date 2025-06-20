'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import AnnonceForm from '@/components/annonces/AnnonceForm';
import type { IAnnonce } from '@/types/interfaces/annonce.interface';

export default function EditAnnoncePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const annonceId = params?.id as string;
  const [annonce, setAnnonce] = useState<IAnnonce | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnonce = async () => {
    try {
      const response = await fetch(`/api/annonces/${annonceId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Annonce non trouvée');
        } else {
          setError('Erreur lors du chargement de l\'annonce');
        }
        return;
      }
      
      const data = await response.json();
      
      // Vérifier que l'annonce appartient au mentor connecté
      if (data.mentorId !== session?.user?.id) {
        setError('Vous n\'êtes pas autorisé à modifier cette annonce');
        return;
      }
      
      setAnnonce(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement de l\'annonce');
    } finally {
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

      if (annonceId) {
        fetchAnnonce();
      }
    }
  }, [session, status, annonceId, router]);

  const handleSubmit = async (data: Partial<IAnnonce>) => {
    try {
      const response = await fetch(`/api/annonces/${annonceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'annonce');
      }

      // Rediriger vers le dashboard après modification réussie
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
          <p className="mt-4 text-gray-600">Chargement de l'annonce...</p>
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

  if (!session || session.user.role !== 'mentor' || !annonce) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Modifier votre annonce</h1>
            <p className="mt-2 text-gray-600">
              Mettez à jour les informations de votre annonce de mentorat.
            </p>
          </div>
          
          <AnnonceForm 
            onSubmit={handleSubmit} 
            initialData={annonce}
          />
        </div>
      </div>
    </div>
  );
}