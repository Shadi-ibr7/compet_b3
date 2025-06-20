'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { IMentor } from '@/types/interfaces/mentor.interface';

interface MentorProfileFormProps {
  mentor: IMentor;
  onSave: (data: Partial<IMentor>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function MentorProfileForm({ 
  mentor, 
  onSave, 
  onCancel, 
  isLoading = false 
}: MentorProfileFormProps) {
  const [formData, setFormData] = useState({
    nom: mentor.nom || '',
    job: mentor.job || '',
    localisation: mentor.localisation || '',
    description: mentor.description || '',
    linkPhoto: mentor.linkPhoto || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement de l\'image');
      }

      const { url } = await response.json();
      setFormData(prev => ({
        ...prev,
        linkPhoto: url
      }));
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

    // Validation
    if (!formData.nom || !formData.job || !formData.localisation || !formData.description) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    try {
      await onSave(formData);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Photo de profil */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo de profil
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={formData.linkPhoto || '/placeholder_pp.png'}
              alt="Photo de profil"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="photo-upload"
              disabled={isLoading || isUploading}
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isUploading ? 'Téléchargement...' : 'Changer la photo'}
            </label>
          </div>
        </div>
      </div>

      {/* Nom */}
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom *
        </label>
        <input
          type="text"
          id="nom"
          value={formData.nom}
          onChange={(e) => handleInputChange('nom', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
          required
        />
      </div>

      {/* Job */}
      <div>
        <label htmlFor="job" className="block text-sm font-medium text-gray-700">
          Métier/Profession *
        </label>
        <input
          type="text"
          id="job"
          value={formData.job}
          onChange={(e) => handleInputChange('job', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Ex: Développeur Full Stack"
          disabled={isLoading}
          required
        />
      </div>

      {/* Localisation */}
      <div>
        <label htmlFor="localisation" className="block text-sm font-medium text-gray-700">
          Localisation *
        </label>
        <input
          type="text"
          id="localisation"
          value={formData.localisation}
          onChange={(e) => handleInputChange('localisation', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Ex: Paris, France"
          disabled={isLoading}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Présentez-vous et votre expertise..."
          disabled={isLoading}
          required
        />
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading || isUploading}
        >
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
}