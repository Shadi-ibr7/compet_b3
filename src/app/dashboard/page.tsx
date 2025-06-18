"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Informations de session :</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  );
}
