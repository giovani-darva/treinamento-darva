"use client";

import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';


function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Token de redefinição inválido ou ausente.');
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Por favor, preencha os dois campos.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!token) {
      setError('Token de redefinição inválido ou ausente.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/auth/reset-password', {
        token: token,
        newPass: newPassword,
      });

      setSuccess('Senha redefinida com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <main className="flex min-h-screen w-screen">
      <div className="hidden md:block md:w-2/3 bg-[url('/background-logo.jpg')] bg-cover bg-center"></div>
      <div className="w-full md:w-1/3 bg-white flex items-center justify-center p-8 md:p-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-black text-center mb-4">Redefinir Senha</h2>
          
          {token ? (
            <>
              <div>
                <label htmlFor="newPassword" className="font-bold text-gray-700">Nova Senha</label>
                <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-blue-500"/>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="font-bold text-gray-700">Confirme a Nova Senha</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-blue-500"/>
              </div>
            </>
          ) : null}
          
          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
          {success && <p className="text-green-600 text-sm font-semibold">{success}</p>}
          
          <button type="submit" disabled={!!success || !token} className="mt-6 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md disabled:bg-gray-400">
            Salvar Nova Senha
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Lembrou sua senha?
            <Link href="/login" className="font-bold text-blue-600 hover:underline ml-1">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}