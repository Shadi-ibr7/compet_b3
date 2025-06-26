import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnnonceDetail from "@/components/annonces/AnnonceDetail";
import { adminDb } from '@/lib/firebase-admin';
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import type { IMentor } from "@/types/interfaces/mentor.interface";
import type { FirestoreAnnonce } from '@/types/firestore';

interface AnnoncePageProps {
  params: Promise<{ id: string }>;
}

async function getAnnonceData(id: string): Promise<IAnnonce | null> {
  try {
    const annonceDoc = await adminDb.collection('annonces').doc(id).get();
    
    if (!annonceDoc.exists) {
      return null;
    }

    const annonceData = annonceDoc.data() as FirestoreAnnonce;
    
    return {
      id: annonceDoc.id,
      ...annonceData,
      date: annonceData.date.toDate()
    } as IAnnonce;
  } catch (error) {
    console.error('Error fetching annonce:', error);
    return null;
  }
}

async function getMentorData(mentorId: string): Promise<IMentor | null> {
  try {
    console.log(`🔍 Recherche mentor ID: ${mentorId}`);
    
    // Première tentative : chercher dans la collection mentors
    const mentorDoc = await adminDb.collection('mentors').doc(mentorId).get();
    
    if (mentorDoc.exists) {
      console.log(`✅ Mentor trouvé dans collection 'mentors'`);
      const mentorData = mentorDoc.data();
      
      // Convert Firestore Timestamps to JavaScript Date objects for serialization
      if (mentorData?.dateCreation && typeof mentorData.dateCreation.toDate === 'function') {
        mentorData.dateCreation = mentorData.dateCreation.toDate();
      }
      if (mentorData?.dateModification && typeof mentorData.dateModification.toDate === 'function') {
        mentorData.dateModification = mentorData.dateModification.toDate();
      }

      return {
        id: mentorDoc.id,
        ...mentorData
      } as IMentor;
    }

    // Fallback : chercher dans la collection users
    console.log(`🔄 Mentor non trouvé dans 'mentors', recherche dans 'users'`);
    const userDoc = await adminDb.collection('users').doc(mentorId).get();
    
    if (!userDoc.exists) {
      console.log(`❌ Mentor non trouvé dans 'users' non plus`);
      return null;
    }

    const userData = userDoc.data();
    console.log(`✅ Mentor trouvé dans collection 'users', construction objet mentor`);
    
    // Vérifier que c'est bien un mentor
    if (userData?.role !== 'mentor') {
      console.log(`❌ Utilisateur trouvé mais rôle = ${userData?.role}, pas mentor`);
      return null;
    }

    // Construire un objet IMentor à partir des données de base
    const mentorFromUser: IMentor = {
      id: userDoc.id,
      name: userData.name || '',
      linkPhoto: userData.linkPhoto || '',
      email: userData.email || '', // ← C'est ça qui manquait !
      role: 'mentor' as const,
      dateCreation: userData.createdAt ? new Date(userData.createdAt) : new Date(),
      // Données spécifiques au mentor avec valeurs par défaut
      nom: userData.name || '',
      job: 'Mentor', // Valeur par défaut
      localisation: userData.city || userData.address || 'Non renseigné',
      description: 'Profil mentor en cours de configuration'
    };

    console.log(`📧 Email mentor récupéré: ${mentorFromUser.email}`);
    return mentorFromUser;

  } catch (error) {
    console.error('❌ Erreur lors de la récupération du mentor:', error);
    return null;
  }
}

export async function generateMetadata({ params }: AnnoncePageProps): Promise<Metadata> {
  const { id } = await params;
  const annonce = await getAnnonceData(id);

  if (!annonce) {
    return {
      title: 'Annonce non trouvée - Molty',
      description: 'Cette annonce n\'existe pas ou n\'est plus disponible.',
    };
  }

  return {
    title: `${annonce.nomMetier} chez ${annonce.nomEtablissement} | Molty`,
    description: `${annonce.description} - ${annonce.type} à ${annonce.localisation}`,
    openGraph: {
      title: `${annonce.nomMetier} chez ${annonce.nomEtablissement} | Molty`,
      description: `${annonce.description} - ${annonce.type} à ${annonce.localisation}`,
      images: annonce.imageUrl ? [{ url: annonce.imageUrl }] : [],
    },
  };
}

export default async function AnnoncePage({ params }: AnnoncePageProps) {
  const { id } = await params;
  
  // Fetch annonce data first
  const annonce = await getAnnonceData(id);

  if (!annonce) {
    notFound();
  }

  // Then fetch mentor data
  const mentor = await getMentorData(annonce.mentorId);

  return <AnnonceDetail annonce={annonce} mentor={mentor} />;
}