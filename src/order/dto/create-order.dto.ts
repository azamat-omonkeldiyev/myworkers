import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { paymentEnum, OrderStatus, meansureEnum } from '@prisma/client';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'product-uuid-123', description: 'Mahsulot IDsi' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'level-uuid-456', description: 'Daraja IDsi' })
  @IsString()
  levelId: string;

  @ApiProperty({
    enum: meansureEnum,
    example: meansureEnum.HOUR,
    description: 'Kelishuv o‘lchovi: soatlik yoki kunlik (HOUR yoki DAY)',
  })
  @IsEnum(meansureEnum)
  meansure: meansureEnum;

  @ApiProperty({
    example: 8,
    required: false,
    description: 'Necha soatga yoki kunga kelishilgan (meansure bo‘yicha)',
  })
  @IsOptional()
  meansureCount?: number;

  @ApiProperty({
    example: 2,
    description: 'Buyurtma qilinayotgan mahsulot miqdori (shtukalarda)',
  })
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderToolDto {
  @ApiProperty({ example: 'tool-uuid-789', description: 'Asbob IDsi' })
  @IsString()
  toolsId: string;

  @ApiProperty({ example: 3, description: 'Asboblar soni' })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  total?: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: { lat: 41.2995, lng: 69.2401 },
    description: 'Buyurtma yetkaziladigan joyning koordinatalari',
  })
  @IsNotEmpty()
  @IsObject()
  location: { lat: number; lng: number };

  @ApiProperty({
    example: 'Toshkent, Chilonzor 10',
    description: 'Buyurtma manzili',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: '2025-06-15T10:00:00.000Z',
    description: 'Ustani chaqirish sanasi',
  })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: paymentEnum, example: paymentEnum.CASH })
  @IsEnum(paymentEnum)
  paymentType: paymentEnum;

  @ApiProperty({ example: true, description: 'Yetkazib berish kerakmi' })
  @IsBoolean()
  withDelivery: boolean;

  //   @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  //   @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    example: 'Eshikni oldida kutib turing',
    description: 'Yetkazuvchiga izoh',
  })
  @IsString()
  commentToDelivery: string;

  userId: string;

  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'Buyurtmadagi mahsulotlar ro‘yxati',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @IsOptional()
  orderItems: CreateOrderItemDto[];

  @ApiProperty({
    type: [CreateOrderToolDto],
    description: 'Buyurtma uchun kerakli asboblar',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderToolDto)
  @IsOptional()
  orderTools: CreateOrderToolDto[];
}
