import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/credentials-config';
import { adminDb } from '@/lib/firebase-admin';

const db = adminDb;

interface SiteStats {
  totalUsers: number;
  totalMentors: number;
  totalAnnonces: number;
  totalArticles: number;
  trends: {
    usersThisMonth: number;
    mentorsThisMonth: number;
    annoncesThisMonth: number;
    articlesThisMonth: number;
  };
}

export async function GET() {
  try {
    // Vérifier que l'utilisateur est admin
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    console.log('🔢 Début du calcul des statistiques...');

    // Date de début du mois actuel
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Compter tous les utilisateurs
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;
    const usersThisMonth = usersSnapshot.docs.filter(doc => {
      const data = doc.data();
      if (data.dateCreation && typeof data.dateCreation.toDate === 'function') {
        return data.dateCreation.toDate() >= startOfMonth;
      }
      return false;
    }).length;
    console.log(`👥 Utilisateurs: ${totalUsers} (${usersThisMonth} ce mois)`);

    // Compter les mentors
    const mentorsSnapshot = await db.collection('mentors').get();
    const totalMentors = mentorsSnapshot.size;
    const mentorsThisMonth = mentorsSnapshot.docs.filter(doc => {
      const data = doc.data();
      if (data.dateCreation && typeof data.dateCreation.toDate === 'function') {
        return data.dateCreation.toDate() >= startOfMonth;
      }
      return false;
    }).length;
    console.log(`🎯 Mentors: ${totalMentors} (${mentorsThisMonth} ce mois)`);

    // Compter les annonces
    const annoncesSnapshot = await db.collection('annonces').get();
    const totalAnnonces = annoncesSnapshot.size;
    const annoncesThisMonth = annoncesSnapshot.docs.filter(doc => {
      const data = doc.data();
      if (data.date && typeof data.date.toDate === 'function') {
        return data.date.toDate() >= startOfMonth;
      }
      return false;
    }).length;
    console.log(`💼 Annonces: ${totalAnnonces} (${annoncesThisMonth} ce mois)`);

    // Compter les articles
    const articlesSnapshot = await db.collection('articles').get();
    const totalArticles = articlesSnapshot.size;
    const articlesThisMonth = articlesSnapshot.docs.filter(doc => {
      const data = doc.data();
      if (data.date) {
        // Pour les articles, la date est déjà une string ISO
        const articleDate = new Date(data.date);
        return articleDate >= startOfMonth;
      }
      return false;
    }).length;
    console.log(`📰 Articles: ${totalArticles} (${articlesThisMonth} ce mois)`);

    const stats: SiteStats = {
      totalUsers,
      totalMentors,
      totalAnnonces,
      totalArticles,
      trends: {
        usersThisMonth,
        mentorsThisMonth,
        annoncesThisMonth,
        articlesThisMonth,
      }
    };

    console.log('✅ Statistiques calculées:', stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('❌ Erreur lors du calcul des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors du calcul des statistiques' },
      { status: 500 }
    );
  }
} 