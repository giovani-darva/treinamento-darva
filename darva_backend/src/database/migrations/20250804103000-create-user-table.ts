// src/database/migrations/20250804103000-create-user-table.ts
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
//  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`.execute(db);
  
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('nome', 'varchar(255)', (col) => col.notNull())
    .addColumn('cpf', 'varchar(11)', (col) => col.notNull().unique())
    .addColumn('data_nascimento', 'date', (col) => col.notNull())
    .addColumn('login', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('senha', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}