'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Force un rafraîchissement de la session
    if (status === 'authenticated') {
      router.refresh();
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm">Chargement...</p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <p>Bonjour, {session.user?.name || session.user?.email}</p>
          <p className="text-xs text-gray-500">Role: {session.user?.role}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/auth/signin')}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
    >
      Se connecter
    </button>
  );
}
