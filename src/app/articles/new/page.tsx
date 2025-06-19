"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/articles/ArticleForm';
import type { IArticle } from '@/types/interfaces/article.interface';

export default function NewArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="p-8">Chargement...</div>;
  }

  if (!session || session.user.role !== 'admin') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (articleData: Partial<IArticle>) => {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de l\'article');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-8">Nouvel Article</h1>
        <ArticleForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
