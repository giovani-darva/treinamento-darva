import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProvider } from './database/database.provider';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule global
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: configService.get<string>('ETHEREAL_USER'), // Adicione no seu .env
            pass: configService.get<string>('ETHEREAL_PASS'), // Adicione no seu .env
          },
        },
        defaults: {
          from: '"Nome do App" <noreply@example.com>',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, databaseProvider],
  exports: [databaseProvider],
})
export class AppModule {}