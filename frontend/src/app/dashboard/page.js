"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    switch (role) {
      case 'patient':
        router.replace('/patient/dashboard');
        break;
      case 'pharmacy':
        router.replace('/pharmacy/dashboard');
        break;
      case 'admin':
        router.replace('/admin/dashboard');
        break;
      case 'doctor':
      default:
        router.replace('/doctor/dashboard');
        break;
    }
  }, [role, isAuthenticated, router]);

  return null;
}
