"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
      router.push('/'); 
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
        router.push('/'); 
      }
    };
    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/'); 
  };

  if (!user) {
    return <div className="w-screen min-h-screen flex items-center justify-center bg-gray-100">Carregando...</div>;
  }

  return (
    <main className="w-screen min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="flex flex-col gap-4 text-center">
          
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          
          <p className="text-lg text-gray-600">
            Bem-vindo de volta, 
            <span className="font-bold text-blue-600"> {user.login}</span>!
          </p>

          <p className="text-md text-gray-500">
            Seu ID de usuário é: {user.userId}
          </p>
          
          <button 
            onClick={handleLogout} 
            className="mt-4 py-2 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Sair (Logout)
          </button>
        </div>
      </div>
    </main>
  );
}