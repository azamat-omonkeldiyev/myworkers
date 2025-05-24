import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { TelegramModule } from 'src/bot/bot.module';

@Module({
  imports: [
    TelegramModule, // TelegramService shu module ichida bo'lishi kerak
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
