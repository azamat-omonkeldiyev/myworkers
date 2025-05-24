import { Module } from '@nestjs/common';
import { MasterService } from './master.service';
import { MasterController } from './master.controller';
import { TelegramService } from 'src/bot/bot.service';

@Module({
  controllers: [MasterController],
  providers: [MasterService,TelegramService],
})
export class MasterModule {}
