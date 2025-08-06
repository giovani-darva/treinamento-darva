import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './interfaces/database.interface'; 

export const databaseProvider = {

  provide: 'KYSELY_INSTANCE',

  useFactory: () => {
    const dialect = new PostgresDialect({

      pool: new Pool({
        host: 'localhost',             
        port: 5432,           
        user: 'postgres', 
        password: '1234',   
        database: 'darva_database',    
      }),
    });

    return new Kysely<Database>({ dialect });
  },
};