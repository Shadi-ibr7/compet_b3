"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-24 h-24">
            <Image
              src={session.user.image || '/placeholder_pp.png'}
              alt="Photo de profil"
              fill
              className="rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{session.user.name}</h2>
            <p className="text-gray-600">{session.user.email}</p>
            <p className="text-sm mt-1 capitalize">Rôle : {session.user.role}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Informations de session :</h2>
        <pre className="bg-white p-4 rounded overflow-auto text-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
