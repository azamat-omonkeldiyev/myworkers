import { Module } from '@nestjs/common';
import { TelegramModule } from './bot.module';
import { AppController } from 'src/app.controller';

@Module({
  imports: [
    TelegramModule,
  ],
  controllers: [AppController],
})
export class AppModule {}