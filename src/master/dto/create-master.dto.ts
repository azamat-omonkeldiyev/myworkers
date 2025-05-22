import {
    IsString,
    IsBoolean,
    IsInt,
    IsArray,
    ValidateNested,
    IsUUID,
    Min,
    MaxLength,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  
  class MasterItemDto {
    @ApiProperty({
      example: 'a3f09a17-d54f-4f91-8e2b-ecbdcf20aa12',
      description: 'Product ID (UUID format)',
    })
    @IsUUID()
    productId: string;
  
    @ApiProperty({
      example: 'level UUID',
      description: 'Level ID (UUID format)',
    })
    @IsUUID()
    levelId: string;
  
    @ApiProperty({
      example: 8,
      description: 'Minimal working hours',
    })
    @IsInt()
    @Min(1)
    minWorkingHours: number;
  
    @ApiProperty({
      example: 100000,
      description: 'Hourly price (in soʻm)',
    })
    @IsInt()
    @Min(0)
    priceHourly: number;
  
    @ApiProperty({
      example: 500000,
      description: 'Daily price (in soʻm)',
    })
    @IsInt()
    @Min(0)
    priceDaily: number;
  }
  
  export class CreateMasterDto {
    @ApiProperty({
      example: 'Jasur Karimov',
      description: 'Ustaning toʻliq ismi',
    })
    @IsString()
    @MaxLength(100)
    fullname: string;
  
    @ApiProperty({
      example: '+998901234567',
      description: 'Telefon raqami',
    })
    @IsString()
    phone: string;
  
    @ApiProperty({
      example: 5,
      description: 'Ustaning ish tajribasi (yillarda)',
    })
    @IsInt()
    @Min(0)
    year: number;
  
    @ApiProperty({
      example: 'https://domain.com/images/avatar.jpg',
      description: 'Ustaning rasmi',
    })
    @IsString()
    image: string;
  
    @ApiProperty({
      example: 'https://domain.com/images/passport.jpg',
      description: 'Pasport rasmi',
    })
    @IsString()
    passportImage: string;
  
    @ApiProperty({
      example: 'Men 5 yildan beri elektr jihozlar bilan ishlayman.',
      description: 'Usta haqida qisqacha maʼlumot',
    })
    @IsString()
    @MaxLength(1000)
    about: string;
  
    @ApiProperty({
      type: [MasterItemDto],
      description: 'Ustaga biriktiriladigan mahsulot va darajalar',
      example: [
        {
          productId: 'UUID',
          levelId: 'UUID',
          minWorkingHours: 4,
          priceHourly: 120000,
          priceDaily: 600000,
        },
      ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MasterItemDto)
    masterItems: MasterItemDto[];
  }
  