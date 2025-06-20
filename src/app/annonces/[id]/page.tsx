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
    const mentorDoc = await adminDb.collection('mentors').doc(mentorId).get();
    
    if (!mentorDoc.exists) {
      return null;
    }

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
  } catch (error) {
    console.error('Error fetching mentor:', error);
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