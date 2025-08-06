import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database } from 'src/database/interfaces/database.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('KYSELY_INSTANCE') private readonly db: Kysely<Database>,
  ) {}

  async findAll() {
    return await this.db.selectFrom('users').select([
      'id',
      'nome',
      'cpf',
      'data_nascimento',
      'login',
      'created_at'
    ]).execute();
  }

  async update(id: number, updateUserDto: { nome: string; login: string; cpf: string }) {
    const updatedUser = await this.db
      .updateTable('users')
      .set({
        nome: updateUserDto.nome,
        login: updateUserDto.login,
        cpf: updateUserDto.cpf,
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
      
    if (!updatedUser) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return updatedUser;
  }

  async remove(id: number) {
    const result = await this.db
      .deleteFrom('users')
      .where('id', '=', id)
      .executeTakeFirst();

    if (result.numDeletedRows === 0n) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return { message: `Usuário com ID ${id} excluído com sucesso.` };
  }
}
