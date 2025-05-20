import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Alex' })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString() 
  @MaxLength(16)
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'alexBek@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+998930502314' })
  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Bekodod k, 15-daha' })
  @IsString()
  @MinLength(3)
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'UUID' })
  @IsUUID()
  @IsNotEmpty()
  regionId: string;

  @ApiProperty({
    example: UserRole.USERFIZ,
    enum: [UserRole.USERFIZ, UserRole.USERYUR],
  })
  @IsIn([UserRole.USERFIZ, UserRole.USERYUR])
  role: UserRole;

//   @ApiProperty()
  @IsString()
  @IsOptional()
  INN?: string;

//   @ApiProperty()
  @IsString()
  @IsOptional()
  MFO?: string;

//   @ApiProperty()
  @IsString()
  @IsOptional()
  RC?: string;
  
//   @ApiProperty()
  @IsString()
  @IsOptional()
  Bank?: string;
  
//   @ApiProperty()
  @IsString()
  @IsOptional()
  Oked?: string;
}
