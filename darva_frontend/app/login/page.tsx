"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!login || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        login: login,
        senha: senha,
      });
       const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      router.push('/dashboard');
    } catch (err) {
      setError('Login ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <main className="flex min-h-screen w-screen">
      <div className="hidden md:block md:w-2/3 bg-[url('/background-logo.jpg')] bg-cover bg-center">
      </div>
      <div className="w-full md:w-1/3 bg-white flex items-center justify-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <img
            src="/logo-mobile.png"
            alt="Logo da Empresa"
            className="block md:hidden w-90 mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-black text-center mb-4">Bem-vindo!</h2>

          <div>
            <label htmlFor="login" className="font-bold text-gray-700">Usuário</label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black text-base focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <label htmlFor="senha" className="font-bold text-gray-700">Senha</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black text-base focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-2 font-bold text-gray-600 hover:text-black transition-colors"
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Não possui uma conta?
              <Link href="/cadastro" className="font-bold text-blue-600 hover:underline ml-1">
                Cadastre-se
              </Link>
            </p>

          </div>

          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}

          <button
            type="submit"
            className="mt-6 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}