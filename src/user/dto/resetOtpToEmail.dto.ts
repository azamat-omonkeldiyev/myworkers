import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class ResetPasswordEmailDto {
  @ApiProperty({ example: 'alexBek@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
