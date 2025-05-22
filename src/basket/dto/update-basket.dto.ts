import { PartialType } from '@nestjs/swagger';
import { CreateBasketDto } from './create-basket.dto';

export class UpdateBasketDto extends PartialType(CreateBasketDto) {}
