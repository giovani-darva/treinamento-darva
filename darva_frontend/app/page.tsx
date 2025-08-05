"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="w-screen min-h-screen flex items-center justify-center">
      Redirecionando para o login...
    </div>
  );
}