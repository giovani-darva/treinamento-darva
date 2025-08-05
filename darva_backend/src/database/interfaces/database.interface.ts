import { ColumnType } from 'kysely';

// Esta interface define a estrutura da sua tabela 'users'
export interface UsersTable {
  id: ColumnType<string, never, never>; // O tipo base é string (UUID), nunca será inserido ou atualizado manualmente
  nome: string;
  cpf: string;
  data_nascimento: Date;
  login: string;
  senha: string;
  created_at: ColumnType<Date, never, never>;
}

// Esta é a interface principal do Database.
// Ela mapeia o nome da tabela (como usado no SQL) para sua interface de tipagem.
export interface Database {
  users: UsersTable;
  // Se você tivesse outras tabelas, adicionaria elas aqui.
  // ex: products: ProductsTable;
}