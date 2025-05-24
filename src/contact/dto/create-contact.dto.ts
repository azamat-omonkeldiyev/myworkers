import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Valiyev' })
  @IsString()
  @IsNotEmpty()
  surName: string;

  @ApiProperty({ example: '+998901234567' })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'Tashkent, Uzbekistan' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'I have a question about your services' })
  @IsString()
  message: string;
}