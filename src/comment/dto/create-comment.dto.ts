import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { execArgv } from 'process';

export class CreateStarDto {
  @IsUUID()
  @IsNotEmpty()
  masterId: string;

  userId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  star: number;
}

export class CreateCommentDto {
  @ApiProperty({ example: 'order-uuid' })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  userId: string;

  @ApiProperty({ example: 'good broo' })
  @IsString()
  message: string;

  @ApiProperty({
    example: [
      { masterId: 'master-uuid', star: 4 },
      { masterId: 'master-uuid-2', star: 5 },
    ],
  })
  @IsArray()
  @IsOptional()
  star: CreateStarDto[];
}
