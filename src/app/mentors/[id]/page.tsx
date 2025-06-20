import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MentorDetail from "@/components/mentors/MentorDetail";
import { adminDb } from '@/lib/firebase-admin';
import type { IMentor } from "@/types/interfaces/mentor.interface";
import type { IAnnonce } from "@/types/interfaces/annonce.interface";
import type { FirestoreAnnonce } from '@/types/firestore';

interface MentorPageProps {
  params: Promise<{ id: string }>;
}

async function getMentorData(id: string): Promise<IMentor | null> {
  try {
    const mentorDoc = await adminDb.collection('mentors').doc(id).get();
    
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

async function getMentorAnnonces(id: string): Promise<IAnnonce[]> {
  try {
    const annonceSnapshot = await adminDb.collection('annonces')
      .where('mentorId', '==', id)
      .limit(10)
      .get();

    if (annonceSnapshot.empty) {
      return [];
    }

    return annonceSnapshot.docs.map(doc => {
      const annonceData = doc.data() as FirestoreAnnonce;
      return {
        id: doc.id,
        ...annonceData,
        date: annonceData.date.toDate()
      } as IAnnonce;
    });
  } catch (error) {
    console.error('Error fetching mentor annonces:', error);
    return [];
  }
}

export async function generateMetadata({ params }: MentorPageProps): Promise<Metadata> {
  const { id } = await params;
  const mentor = await getMentorData(id);

  if (!mentor) {
    return {
      title: 'Mentor non trouvé - Molty',
      description: 'Ce mentor n\'existe pas ou n\'est plus disponible.',
    };
  }

  return {
    title: `${mentor.nom} - ${mentor.job} | Molty`,
    description: `Découvrez le profil de ${mentor.nom}, ${mentor.job} basé à ${mentor.localisation}. ${mentor.description}`,
    openGraph: {
      title: `${mentor.nom} - ${mentor.job} | Molty`,
      description: `Découvrez le profil de ${mentor.nom}, ${mentor.job} basé à ${mentor.localisation}`,
      images: mentor.linkPhoto ? [{ url: mentor.linkPhoto }] : [],
    },
  };
}

export default async function MentorPage({ params }: MentorPageProps) {
  const { id } = await params;
  
  // Fetch mentor data and annonces in parallel
  const [mentor, annonces] = await Promise.all([
    getMentorData(id),
    getMentorAnnonces(id)
  ]);

  if (!mentor) {
    notFound();
  }

  return <MentorDetail mentor={mentor} annonces={annonces} />;
}