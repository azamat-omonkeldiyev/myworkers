import { Module } from '@nestjs/common';
import { GeneralInfoService } from './general-info.service';
import { GeneralInfoController } from './general-info.controller';

@Module({
  controllers: [GeneralInfoController],
  providers: [GeneralInfoService],
})
export class GeneralInfoModule {}
