// Em: src/database/database.provider.ts

import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './interfaces/database.interface'; // Explicaremos isso na Etapa 4

// Este é o nosso objeto provedor. É um padrão do NestJS.
export const databaseProvider = {
  // 1. 'provide': É o "token" ou nome de identificação da nossa conexão.
  //    Quando quisermos usar a conexão, pediremos ao NestJS por 'KYSELY_INSTANCE'.
  provide: 'KYSELY_INSTANCE',

  // 2. 'useFactory': É a função que efetivamente constrói e retorna o objeto.
  //    O NestJS executará esta função para nós.
  useFactory: () => {
    // 3. 'dialect': Define o "dialeto" do banco de dados que vamos usar.
    //    O Kysely precisa saber como "conversar" com o PostgreSQL.
    const dialect = new PostgresDialect({

      // 4. 'pool': O 'pg' (node-postgres) usa um "pool" de conexões para ser mais eficiente.
      //    Em vez de abrir e fechar uma conexão a cada consulta, ele mantém algumas prontas para uso.
      pool: new Pool({
        // 5. PARÂMETROS DA CONEXÃO:
        host: 'localhost',              // Onde o banco de dados está rodando. Como o Docker está na sua máquina, é 'localhost'.
        port: 5432,                     // A porta que mapeamos no comando 'docker run'.
        user: 'postgres',               // O usuário padrão do PostgreSQL.
        password: '1234',   // IMPORTANTE: A senha que você definiu no comando 'docker run'.
        database: 'darva_database',     // O banco de dados específico que criamos no DBeaver.
      }),
    });

    // 6. 'return': Aqui, finalmente, criamos e retornamos a instância principal do Kysely.
    //    Esta instância é o que usaremos para fazer todas as nossas consultas (SELECT, INSERT, etc.).
    return new Kysely<Database>({ dialect });
  },
};