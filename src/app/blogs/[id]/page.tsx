import Link from 'next/link';
import Image from 'next/image';
import { IArticle } from '@/types/interfaces/article.interface';

async function getArticle(id: string) {
  const response = await fetch(`http://localhost:3000/api/articles/${id}`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  return response.json();
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article: IArticle = await getArticle(params.id);

  if (!article) {
    return <div>Article non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/blogs" className="text-indigo-600 hover:text-indigo-800 mb-8 inline-block">← Retour aux articles</Link>
      
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full max-w-[300px] mx-auto pt-6">
          <Image
            src={article.imageUrl || '/placeholder_article.png'}
            alt={article.title}
            width={300}
            height={200}
            className="w-full h-auto object-cover rounded-lg"
            priority={true}
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <div className="text-gray-600 mb-6">
            <p className="mb-1">Par {article.auteur}</p>
            <p>Publié le {new Date(article.date).toLocaleDateString('fr-FR')}</p>
          </div>

        {article.content && (
          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: article.content }} />
        )}

        {article.lienPodcast && (
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-3">Écouter le podcast</h2>
            <audio controls className="w-full mb-3">
              <source src={article.lienPodcast} type="audio/mpeg" />
              Votre navigateur ne supporte pas la lecture audio
            </audio>
            <a 
              href={article.lienPodcast}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Télécharger le podcast
            </a>
          </div>
        )}

        {article.meta?.keywords && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Mots-clés</h3>
            <div className="flex flex-wrap gap-2">
              {article.meta.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        </div>
      </article>
    </div>
  );
}


