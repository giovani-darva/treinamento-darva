import { Kysely, PostgresDialect, Migrator } from 'kysely';
import { Pool } from 'pg';

import * as Migration20250804 from './database/migrations/20250804103000-create-user-table';
import * as Migration20250807 from './database/migrations/20250807140000-add-email-and-reset-token-to-users';

async function migrate() {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '1234',
        database: 'darva_database',
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: {
      getMigrations: async () => {
        return {
          '20250804103000-create-user-table': Migration20250804,
          '20250807140000-add-email-and-reset-token-to-users': Migration20250807,
        };
      },
    },
  });

  console.log('Rodando migrações...');
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migração "${it.migrationName}" foi executada com sucesso`);
    } else if (it.status === 'Error') {
      console.error(`Falha ao executar migração "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('Falha ao rodar migrações:');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
  console.log('Migrações concluídas.');
}

migrate();