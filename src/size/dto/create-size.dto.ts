import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateSizeDto {
    @ApiProperty({example: "40x30"})
    @IsString()
    @IsNotEmpty()
    name_uz: string
    @ApiProperty({example: "40x30"})
    @IsString()
    @IsNotEmpty()
    name_en: string
    @ApiProperty({example: "40xx30"})
    @IsString()
    @IsNotEmpty()
    name_ru: string
}
