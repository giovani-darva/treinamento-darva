"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/navbar';

interface User {
  userId: number;
  login: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login'); 
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Falha ao buscar perfil, token inválido ou expirado:', error);
        localStorage.removeItem('access_token');
        router.push('/login'); 
      }
    };
    fetchUserProfile();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="w-full flex items-center justify-center py-10">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            
            <p className="text-lg text-gray-600">
              Bem-vindo de volta, 
              <span className="font-bold text-blue-600"> {user.login}</span>!
            </p>

            <p className="text-md text-gray-500">
              Seu ID de usuário é: {user.userId}
            </p>
            
          </div>
        </div>
      </main>
    </div>
  );
}