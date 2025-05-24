import { PartialType } from '@nestjs/swagger';
import { CreateGeneralInfoDto } from './create-general-info.dto';

export class UpdateGeneralInfoDto extends PartialType(CreateGeneralInfoDto) {}
