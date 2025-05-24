import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private readonly bot: TelegramBot;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined in .env file');
    }

    this.bot = new TelegramBot(token, { polling: false });
  }

  async sendMessageToUser(message: string): Promise<boolean> {
    try {
      let id = process.env.TELEGRAM_ID
      console.log(id)
      if(id){
        await this.bot.sendMessage(id.toString(), message);
        return true;
      }
      return false
    } catch (error) {
      console.error(`Xabar yuborishda xato: ${error.message}`);
      return false;
    }
  }
}