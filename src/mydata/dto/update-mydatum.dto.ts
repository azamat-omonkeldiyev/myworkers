import { PartialType } from '@nestjs/swagger';
import { CreateMydatumDto } from './create-mydatum.dto';

export class UpdateMydatumDto extends PartialType(CreateMydatumDto) {}
