import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('email', 'varchar(255)')
    .execute();

  await sql`
    UPDATE users 
    SET email = CONCAT('user_', id, '@temp-email.com') 
    WHERE email IS NULL
  `.execute(db);

  await db.schema
    .alterTable('users')
    .alterColumn('email', (col) => col.setNotNull())
    .execute();

  await db.schema
    .createIndex('users_email_unique')
    .on('users')
    .column('email')
    .unique()
    .execute();

  await db.schema
    .alterTable('users')
    .addColumn('password_reset_token', 'varchar(255)')
    .addColumn('password_reset_expires', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('users_email_unique')
    .execute();

  await db.schema
    .alterTable('users')
    .dropColumn('email')
    .dropColumn('password_reset_token')
    .dropColumn('password_reset_expires')
    .execute();
}