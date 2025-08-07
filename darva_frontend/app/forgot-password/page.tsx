"use client";

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Por favor, insira seu e-mail.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', {
        email: email,
      });
      setMessage(response.data.message);
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  return (
    <main className="flex min-h-screen w-screen">
      <div className="hidden md:block md:w-2/3 bg-[url('/background-logo.jpg')] bg-cover bg-center"></div>
      <div className="w-full md:w-1/3 bg-white flex items-center justify-center p-8 md:p-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-black text-center mb-4">Recuperar Senha</h2>
          <p className="text-center text-gray-600 mb-4">
            Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </p>

          <div>
            <label htmlFor="email" className="font-bold text-gray-700">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm font-semibold text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm font-semibold text-center">{message}</p>}

          <button
            type="submit"
            className="mt-6 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md"
          >
            Enviar Link de Recuperação
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Lembrou sua senha?
            <Link href="/login" className="font-bold text-blue-600 hover:underline ml-1">
              Voltar para o Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}