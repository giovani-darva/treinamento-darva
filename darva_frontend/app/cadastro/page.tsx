"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CadastroPage() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!nome || !cpf || !dataNascimento || !login || !senha) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        const cpfLimpo = cpf.replace(/[^\d]/g, '');

        try {
            await axios.post('http://localhost:3000/auth/register', {
                nome,
                cpf: cpfLimpo,
                data_nascimento: dataNascimento,
                login,
                senha,
            });

            setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');

            setTimeout(() => {
                router.push('/login');
            }, 2000);

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
            <div className="hidden md:block md:w-2/3 bg-[url('/background-logo.jpg')] bg-cover bg-center">
            </div>
            <div className="w-full md:w-1/3 bg-white flex items-center justify-center p-8 md:p-12">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 w-full max-w-sm"
                >
                    <img
                        src="/logo-mobile.png"
                        alt="Logo da Empresa"
                        className="block md:hidden w-90 mx-auto mb-6"
                    />
                    <h2 className="text-2xl font-bold text-black text-center mb-4">Crie sua Conta</h2>

                    <div>
                        <label htmlFor="nome" className="font-bold text-gray-700">Nome Completo</label>
                        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="cpf" className="font-bold text-gray-700">CPF</label>
                        <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="dataNascimento" className="font-bold text-gray-700">Data de Nascimento</label>
                        <input type="date" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="login" className="font-bold text-gray-700">Login</label>
                        <input type="text" id="login" value={login} onChange={(e) => setLogin(e.target.value)} className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="senha" className="font-bold text-gray-700">Senha</label>
                        <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full mt-1 p-2 bg-transparent border-b-2 border-gray-400 text-black focus:outline-none focus:border-blue-500" />
                    </div>

                    {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
                    {success && <p className="text-green-600 text-sm font-semibold">{success}</p>}

                    <button type="submit" className="mt-6 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md">
                        Cadastrar
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-2">
                        Já possui uma conta?
                        <Link href="/login" className="font-bold text-blue-600 hover:underline ml-1">
                            Faça login
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}