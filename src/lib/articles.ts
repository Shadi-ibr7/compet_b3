import { adminDb } from './firebase-admin';
import { Article } from '@/types/article';

const COLLECTION = 'articles';

export async function getAllArticles() {
  const snapshot = await adminDb.collection(COLLECTION).get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Article[];
}

export async function getArticleById(id: string) {
  const doc = await adminDb.collection(COLLECTION).doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() } as Article;
}

export async function getArticlesByTag(tag: string) {
  const snapshot = await adminDb.collection(COLLECTION)
    .where('tags', 'array-contains', tag)
    .get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Article[];
}

export async function createArticle(article: Omit<Article, 'id'>) {
  const docRef = await adminDb.collection(COLLECTION).add({
    ...article,
    publishedAt: new Date().toISOString()
  });
  const newDoc = await docRef.get();
  return { id: newDoc.id, ...newDoc.data() } as Article;
}

export async function updateArticle(id: string, article: Partial<Article>) {
  const docRef = adminDb.collection(COLLECTION).doc(id);
  await docRef.update({
    ...article,
    updatedAt: new Date().toISOString()
  });
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() } as Article;
}

export async function deleteArticle(id: string) {
  await adminDb.collection(COLLECTION).doc(id).delete();
  return true;
}
