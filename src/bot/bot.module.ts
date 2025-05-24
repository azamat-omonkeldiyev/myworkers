import { Module } from '@nestjs/common';
import { TelegramService } from './bot.service';

@Module({
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}