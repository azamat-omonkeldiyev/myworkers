import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserService } from 'src/user/user.service';
import { TelegramModule } from 'src/bot/bot.module';

@Module({
  imports: [TelegramModule],
  controllers: [AdminController],
  providers: [UserService]
})
export class AdminModule {}

