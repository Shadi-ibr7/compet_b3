import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/credentials-config';
import { adminDb } from '@/lib/firebase-admin';

// POST - Traitement du paiement fictif
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { userId } = await request.json();

    // Vérifier que l'utilisateur traite son propre paiement
    if (session.user.id !== userId && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Vérifier que l'utilisateur existe et est un Molt
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userData = userDoc.data();
    
    if (userData?.role !== 'molt') {
      return NextResponse.json({ error: 'Seuls les utilisateurs Molt peuvent effectuer ce paiement' }, { status: 400 });
    }

    // Simuler le traitement du paiement (attendre 2 secondes)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mettre à jour le statut paid à true
    await adminDb.collection('users').doc(userId).update({
      paid: true,
      paidAt: new Date(),
      status: 'active'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Paiement traité avec succès',
      userId: userId
    });

  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement du paiement' },
      { status: 500 }
    );
  }
}