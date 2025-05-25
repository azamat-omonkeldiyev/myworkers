import { PartialType } from '@nestjs/swagger';
import { CreateAdminExportDto } from './create-admin-export.dto';

export class UpdateAdminExportDto extends PartialType(CreateAdminExportDto) {}
