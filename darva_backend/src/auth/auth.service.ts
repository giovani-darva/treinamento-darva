import { Inject, Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Kysely } from 'kysely';
import { Database } from 'src/database/interfaces/database.interface';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AuthService {
  constructor(
    @Inject('KYSELY_INSTANCE') private readonly db: Kysely<Database>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

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
    if (!userData.senha) {
      throw new InternalServerErrorException('Senha é obrigatória.');
    }

    const hashedPassword = await bcrypt.hash(userData.senha, 10);

    try {
      const newUser = await this.db
        .insertInto('users')
        .values({
          nome: userData.nome,
          cpf: userData.cpf,
          data_nascimento: userData.data_nascimento,
          login: userData.login,
          senha: hashedPassword,
          email: userData.email,
        })
        .returning(['id', 'login', 'nome', 'email'])
        .executeTakeFirstOrThrow();

      return newUser;

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('CPF, Login ou Email já cadastrado.');
      }

      throw new InternalServerErrorException('Ocorreu um erro ao cadastrar o usuário.');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
    
    if (!user) {
      return { message: 'Link de redefinição enviado para o email!' };
    }

    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    await this.db
      .updateTable('users')
      .set({ 
        password_reset_token: resetToken, 
        password_reset_expires: resetExpires 
      })
      .where('id', '=', user.id)
      .execute();

    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Link para Redefinição de Senha',
      html: `
        <h2>Redefinição de Senha</h2>
        <p>Você está recebendo este e-mail porque solicitou a redefinição de senha.</p>
        <p>Por favor, clique no seguinte link, ou cole no seu navegador para completar o processo:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
        <p>Este link expirará em 1 hora.</p>
        <p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
      `,
    });

    return { message: 'Link de redefinição enviado para o email!' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('password_reset_token', '=', token)
      .where('password_reset_expires', '>', new Date())
      .executeTakeFirst();

    if (!user) {
      throw new UnauthorizedException('Token de redefinição inválido ou expirado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.db
      .updateTable('users')
      .set({
        senha: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
      })
      .where('id', '=', user.id)
      .execute();

    return { message: 'Senha redefinida com sucesso.' };
  }
}