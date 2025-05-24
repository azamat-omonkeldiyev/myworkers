import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'alexBek@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'StrongPass123' })
  @MaxLength(16)
  @MinLength(8)
  @IsString()
  newPassword: string;

}
