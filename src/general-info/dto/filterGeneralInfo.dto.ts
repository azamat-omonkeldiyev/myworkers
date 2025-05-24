import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class FilterGeneralInfoDto {

  @ApiPropertyOptional({
    description: 'Page number for pagination (default is 1)',
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (default is 10)',
  })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search in email, phones, or links arrays',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by (e.g., createdAt)',
  })
  @IsOptional()
  @IsString()
  orderBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort direction: asc or desc (default: desc)',
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'desc';
}
