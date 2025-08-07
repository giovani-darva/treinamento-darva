import { ColumnType, Generated } from 'kysely';

export interface UsersTable {
  id: Generated<number>;
  nome: string;
  cpf: string;
  email:string;
  data_nascimento: Date;
  login: string;
  senha: string;
  password_reset_token: string | null; 
  password_reset_expires: Date | null;
  created_at: ColumnType<Date, never, never>;
}

export interface Database {
  users: UsersTable;

}