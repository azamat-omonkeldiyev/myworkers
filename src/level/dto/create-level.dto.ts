import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLevelDto {
    @ApiProperty({ example: 'Yuqori tajriba' })
    @IsString()
    @IsNotEmpty()
    name_uz: string;
  
    @ApiProperty({ example: 'Professional' })
    @IsString()
    @IsNotEmpty()
    name_en: string;
  
    @ApiProperty({ example: 'Профессионал' })
    @IsString()
    @IsNotEmpty()
    name_ru: string;

    @ApiProperty({ example: 2 })
    @IsNumber()
    @IsNotEmpty()
    minWorkingHours: number;


    @ApiProperty({ example: 100 })
    @IsNumber()
    @IsNotEmpty()
    priceHourly: number;
    

    @ApiProperty({ example: 600 })
    @IsNumber()
    @IsNotEmpty()
    priceDaily: number
}
