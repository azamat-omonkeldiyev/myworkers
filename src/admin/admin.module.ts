import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [AdminController],
  providers: [UserService]
})
export class AdminModule {}

