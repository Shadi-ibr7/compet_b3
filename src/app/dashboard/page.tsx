"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useState } from 'react';
import type { IArticle } from '@/types/interfaces/article.interface';
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user.role === 'admin') {
      fetch('/api/articles')
        .then(res => res.json())
        .then(data => {
          setArticles(data);
          setIsLoading(false);
        })
        .catch(() => {
          setError('Erreur lors du chargement des articles');
          setIsLoading(false);
        });
    }
  }, [session]);

  if (status === "loading" || isLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <Image
              src={session.user.image || '/placeholder_pp.png'}
              alt="Photo de profil"
              width={70}
              height={70}
              className="rounded-full object-cover border-2 border-gray-200"
              priority
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{session.user.name}</h2>
            <p className="text-gray-600">{session.user.email}</p>
            <p className="text-sm mt-1 capitalize">Rôle : {session.user.role}</p>
          </div>
        </div>
      </div>

      {session.user.role === 'admin' && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gestion des Articles</h2>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => router.push('/articles/new')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nouvel Article
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article: IArticle) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500">{article.content ? article.content.substring(0, 60) + '...' : 'Pas de contenu'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.auteur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => router.push(`/articles/${article.id}/edit`)}
                      >
                        Modifier
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => article.id ? setArticleToDelete(article.id) : null}
                        disabled={isDeleting}
                      >
                        {isDeleting && articleToDelete === article.id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal de confirmation de suppression */}
          {articleToDelete && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmer la suppression</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      onClick={() => setArticleToDelete(null)}
                      disabled={isDeleting}
                    >
                      Annuler
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={async () => {
                        if (!articleToDelete) return;
                        setIsDeleting(true);
                        try {
                          const response = await fetch(`/api/articles/${articleToDelete}`, {
                            method: 'DELETE',
                          });
                          
                          if (!response.ok) {
                            throw new Error('Erreur lors de la suppression');
                          }
                          
                          // Mettre à jour la liste des articles
                          setArticles(articles.filter(a => a.id !== articleToDelete));
                          setArticleToDelete(null);
                        } catch (err: unknown) {
                          console.error('Erreur lors de la suppression:', err);
                          setError('Erreur lors de la suppression de l\'article');
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
