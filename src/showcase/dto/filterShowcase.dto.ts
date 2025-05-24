import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FilterShowcaseDto {
    @ApiPropertyOptional({ description: 'Search by name or description' })
    @IsOptional()
    @IsString()
    search?: string;
  
    @ApiPropertyOptional({ description: 'Limit' })
    @IsOptional()
    page?: number;
  
    @ApiPropertyOptional({ description: 'Page' })
    @IsOptional()
    limit?: number;
  
    @ApiPropertyOptional({ description: 'Order by field name' })
    @IsOptional()
    orderBy?: string;
  
    @ApiPropertyOptional({ description: 'asc or desc' })
    @IsOptional()
    order?: 'asc' | 'desc';
  }