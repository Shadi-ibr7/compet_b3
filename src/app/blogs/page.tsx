'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IArticle } from '@/types/interfaces/article.interface';

export default function BlogsPage() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        console.log('Articles reçus:', data); // Debug
        setArticles(data);
      } catch (err) {
        setError('Error loading articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Chargement des articles...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/blogs/${article.id}`} className="block hover:opacity-90 transition-opacity">
              <div className="w-full max-w-[300px] mx-auto">
                <Image
                  src={article.imageUrl || '/placeholder_article.png'}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover rounded-t-lg"
                  priority={true}
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Par {article.auteur} - {new Date(article.date).toLocaleDateString('fr-FR')}
                </p>
                {article.meta?.description && (
                  <p className="text-gray-700 line-clamp-3">{article.meta.description}</p>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
