import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Bog‘bon' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Gardener' })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({ example: 'Садовник' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @IsString()
  @ApiProperty({ example: 'product-image.jpg' })
  @IsNotEmpty()
  image: string;


  // @IsBoolean()
  isActive: boolean;

  @IsArray()
  @ApiProperty({
    example: ['tool-id-1', 'tool-id-2'],
    description: 'Tools ID lar ro‘yxati',
  })
  toolIds: string[];

  @IsArray()
  @ApiProperty({
    example: ['level-id-1', 'level-id-2'],
    description: 'Levels ID lar ro‘yxati',
  })
  levelIds: string[];
}
