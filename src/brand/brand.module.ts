import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TelegramService } from 'src/bot/bot.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService,TelegramService],
})
export class BrandModule {}
