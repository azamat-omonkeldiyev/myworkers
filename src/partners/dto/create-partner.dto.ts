import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ example: 'O‘zbekiston banki', required: false })
  @IsOptional()
  @IsString()
  name_uz?: string;

  @ApiProperty({ example: 'Uzbekistan bank', required: false })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({ example: 'Узбекистан банк', required: false })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({ example: 'https://example.com' })
  @IsUrl()
  link: string;

  @ApiProperty({ example: 'image.jpg' })
  @IsString()
  image: string;
}
