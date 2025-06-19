'use client';

import { useSession } from 'next-auth/react';

export default function SessionInfo() {
  const { data: session, status } = useSession();

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold mb-2">État de la Session :</h3>
      <p>Status: {status}</p>
      {session && (
        <div className="mt-2">
          <p>ID: {session.user?.id}</p>
          <p>Email: {session.user?.email}</p>
          <p>Role: {session.user?.role}</p>
          <p>Name: {session.user?.name}</p>
        </div>
      )}
    </div>
  );
}
