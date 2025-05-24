import { Module } from '@nestjs/common';
import { MyDataController } from './mydata.controller';
import { MyDataService } from './mydata.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MyDataController],
  providers: [MyDataService, PrismaService],
})
export class MyDataModule {}
