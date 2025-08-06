import { ColumnType, Generated } from 'kysely';

export interface UsersTable {
  id: Generated<number>;
  nome: string;
  cpf: string;
  data_nascimento: Date;
  login: string;
  senha: string;
  created_at: ColumnType<Date, never, never>;
}

export interface Database {
  users: UsersTable;

}