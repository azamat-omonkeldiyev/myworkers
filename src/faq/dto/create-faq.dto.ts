import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({ example: 'How do I reset my password?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  answer: string
}
