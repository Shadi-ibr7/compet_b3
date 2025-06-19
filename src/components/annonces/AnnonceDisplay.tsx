"use client";

import { useState } from 'react';

import type { IAnnonce } from '@/types/interfaces/annonce.interface';

interface AnnonceDisplayProps {
  annonce: IAnnonce;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export default function AnnonceDisplay({ annonce, onEdit, onDelete }: AnnonceDisplayProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Votre annonce actuelle</h3>
        <p className="text-sm text-gray-500">
          Publiée le {new Date(annonce.date).toLocaleDateString('fr-FR')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Localisation</h4>
          <p className="mt-1 text-sm text-gray-900">{annonce.localisation}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Description</h4>
          <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{annonce.description}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onEdit}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Modifier
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </div>
  );
}
