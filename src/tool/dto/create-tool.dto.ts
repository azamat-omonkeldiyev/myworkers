import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ example: 'Burg‘ulash mashinasi', description: 'Asbobning o‘zbekcha nomi' })
  @IsString()
  @IsNotEmpty()
  name_uz: string;

  @ApiProperty({ example: 'Drill machine', description: 'Asbobning inglizcha nomi' })
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({ example: 'Дрель', description: 'Asbobning ruscha nomi' })
  @IsString()
  @IsNotEmpty()
  name_ru: string;

  @ApiProperty({ example: 'Zich metallni burg‘ulash uchun mo‘ljallangan', description: 'O‘zbekcha tavsifi' })
  @IsString()
  @IsOptional()
  description_uz: string;

  @ApiProperty({ example: 'Designed for drilling thick metal', description: 'Inglizcha tavsifi' })
  @IsString()
  @IsOptional()
  description_en: string;

  @ApiProperty({ example: 'Предназначен для сверления толстого металла', description: 'Ruscha tavsifi' })
  @IsString()
  @IsOptional()
  description_ru: string;

  @ApiProperty({ example: 150000, description: 'Asbob narxi (so‘mda)' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 25, description: 'Ombordagi miqdori' })
  @IsNumber()
  quantity: number;

//   @IsNumber()
  code: number;

  @ApiProperty({ example: 'c23b1e5d-2c0a-4e6f-b8b3-df2e7d117fce', description: 'Brendning UUID raqami' })
  @IsUUID()
  brandId: string;

  @ApiProperty({ example: 'a33f7c9c-b1f4-412d-a2cb-bb8203c5f3c9', description: 'Sig‘im ID raqami' })
  @IsUUID()
  capacityId: string;

  @ApiProperty({ example: '9fb32d21-1d87-4c45-80a2-621e9e0d23bd', description: 'O‘lcham ID raqami' })
  @IsUUID()
  sizeId: string;

  @ApiProperty({ example: true, description: 'Faollik holati' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 'https://example.com/images/tool.jpg', description: 'Asbob rasmi (URL yoki fayl nomi)' })
  @IsString()
  image: string;
}
