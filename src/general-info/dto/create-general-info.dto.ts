import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateGeneralInfoDto {
  @ApiProperty({
    example: ['info@example.com', 'support@example.com'],
    description: 'List of contact emails',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  email: string[];

  @ApiProperty({
    example: ['+998901234567', '+998931112233'],
    description: 'List of contact phone numbers',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  phones: string[];

  @ApiProperty({
    example: ['https://t.me/example', 'https://instagram.com/example'],
    description: 'List of external links',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  links: string[];

  @ApiProperty({
    example: '123456789',
    description: 'Telegram bot ID or Telegram user ID',
  })
  @IsString()
  tgId: string;
}
