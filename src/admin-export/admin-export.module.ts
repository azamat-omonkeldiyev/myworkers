import { Module } from '@nestjs/common';
import { AdminExportService } from './admin-export.service';
import { AdminExportController } from './admin-export.controller';

@Module({
  controllers: [AdminExportController],
  providers: [AdminExportService],
})
export class AdminExportModule {}
