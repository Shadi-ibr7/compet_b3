'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import MentorDashboard from '@/components/dashboard/MentorDashboard';
import UserProfile from '@/components/dashboard/UserProfile';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div>
          <div style={{ margin: '0 auto', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Routage par rôle
  switch (session.user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'mentor':
      return <MentorDashboard />;
    case 'molt':
    default:
      return <UserProfile />;
  }
} 