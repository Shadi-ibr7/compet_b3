import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Convertir le fichier en buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Créer un nom de fichier unique
    const fileName = `${Date.now()}-${file.name}`;
    const bucket = adminStorage.bucket(process.env.NEXT_PUBLIC_STORAGE_BUCKET);
    const fileUpload = bucket.file(fileName);

    // Upload du fichier
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
      },
    });

    // Rendre le fichier public pour avoir une URL permanente
    await fileUpload.makePublic();

    // Créer l'URL publique permanente
    const publicUrl = `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/${fileName}`;

    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      fileName 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}
