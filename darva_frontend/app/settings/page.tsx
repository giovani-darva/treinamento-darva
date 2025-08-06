// Em: app/settings/page.tsx

"use client";

import { useEffect, useState, Fragment } from 'react'; // Adicionado Fragment
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';

// Tipagem para os dados de um usuário
interface User {
  id: number;
  nome: string;
  cpf: string;
  login: string;
}

// Tipagem para os dados que estão sendo editados
type EditingUser = Omit<User, 'id'>;

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  // Estados para controlar a edição e exclusão
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUserData, setEditingUserData] = useState<EditingUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Função para buscar todos os usuários
  const fetchUsers = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Falha ao buscar usuários:', error);
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // O router não é mais uma dependência necessária aqui

  // Funções para controlar a edição
  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditingUserData({ nome: user.nome, login: user.login, cpf: user.cpf });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingUserData(null);
  };

  const handleSaveEdit = async (id: number) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`http://localhost:3000/users/${id}`, editingUserData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleCancelEdit(); // Sai do modo de edição
      fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
      console.error('Falha ao salvar usuário:', error);
      alert('Não foi possível salvar as alterações.');
    }
  };

  const handleEditDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingUserData({
      ...editingUserData!,
      [e.target.name]: e.target.value,
    });
  };

  // Funções para controlar a exclusão e o modal
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('access_token');
    if (!userToDelete) return;

    try {
      await axios.delete(`http://localhost:3000/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
      console.error('Falha ao excluir usuário:', error);
      alert('Não foi possível excluir o usuário.');
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Gerenciamento de Usuários</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  {editingUserId === user.id ? (
                    // ===== MODO DE EDIÇÃO COM BOTÕES ESTILIZADOS =====
                    <Fragment>
                      <td className="px-6 py-4"><input type="text" name="nome" value={editingUserData?.nome} onChange={handleEditDataChange} className="w-full p-1 border rounded text-black" /></td>
                      <td className="px-6 py-4"><input type="text" name="login" value={editingUserData?.login} onChange={handleEditDataChange} className="w-full p-1 border rounded text-black" /></td>
                      <td className="px-6 py-4"><input type="text" name="cpf" value={editingUserData?.cpf} onChange={handleEditDataChange} className="w-full p-1 border rounded text-black" /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            onClick={() => handleSaveEdit(user.id)}
                            className="py-1 px-3 rounded-md font-semibold text-green-700 bg-green-100 hover:bg-green-200 transition-colors"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="py-1 px-3 rounded-md font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </Fragment>
                  ) : (
                    // ===== MODO DE VISUALIZAÇÃO COM BOTÕES ESTILIZADOS =====
                    <Fragment>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.login}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.cpf}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="py-1 px-3 rounded-md font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="py-1 px-3 rounded-md font-semibold text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </Fragment>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 z-10"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-20">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Excluir Usuário</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Você tem certeza que deseja excluir o usuário <strong>{userToDelete?.nome}</strong>? Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={handleConfirmDelete} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">
                  Confirmar Exclusão
                </button>
                <button onClick={() => setShowDeleteModal(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}