import { Inject, Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Kysely } from 'kysely';
import { Database } from 'src/database/interfaces/database.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject('KYSELY_INSTANCE') private readonly db: Kysely<Database>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('login', '=', login)
      .executeTakeFirst();

    if (user && (await bcrypt.compare(pass, user.senha))) {
      const { senha, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { login: user.login, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(user: any) {
    const payload = { login: user.login, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: any) {
    console.log('--- [AuthService] Iniciando processo de registro ---');
    console.log('Dados recebidos do frontend:', userData);

    if (!userData.senha) {
      console.error('ERRO: A senha não foi fornecida nos dados do usuário.');
      throw new InternalServerErrorException('Senha é obrigatória.');
    }

    const hashedPassword = await bcrypt.hash(userData.senha, 10);
    console.log('Senha criptografada com sucesso.');

    try {
      console.log('Tentando inserir usuário no banco de dados com os seguintes valores:', {
        nome: userData.nome,
        cpf: userData.cpf,
        data_nascimento: userData.data_nascimento,
        login: userData.login,
        senha: hashedPassword,
      });

      const newUser = await this.db
        .insertInto('users')
        .values({
          nome: userData.nome,
          cpf: userData.cpf,
          data_nascimento: userData.data_nascimento,
          login: userData.login,
          senha: hashedPassword,
        })
        .returning(['id', 'login', 'nome'])
        .executeTakeFirstOrThrow();

      console.log('Usuário inserido com sucesso no banco:', newUser);
      console.log('----------------------------------------------------');
      return newUser;

    } catch (error) {
      console.error('--- ERRO CAPTURADO AO TENTAR INSERIR NO BANCO ---');
      console.error(error);
      console.error('----------------------------------------------------');

      if (error.code === '23505') {
        throw new ConflictException('CPF ou Login já cadastrado.');
      }

      throw new InternalServerErrorException('Ocorreu um erro ao cadastrar o usuário.');
    }
  }
}