import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateBrandDto {
    @ApiProperty({example: "Bosch"})
    @IsString()
    @IsNotEmpty()
    name_uz: string
    @ApiProperty({example: "Bosch"})
    @IsString()
    @IsNotEmpty()
    name_en: string
    @ApiProperty({example: "Bosch"})
    @IsString()
    @IsNotEmpty()
    name_ru: string
}
