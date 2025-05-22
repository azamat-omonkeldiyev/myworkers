import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateCapacityDto {
    @ApiProperty({example: "120 Volt"})
    @IsString()
    @IsNotEmpty()
    name_uz: string
    @ApiProperty({example: "120 Volt"})
    @IsString()
    @IsNotEmpty()
    name_en: string
    @ApiProperty({example: "120 Вольт"})
    @IsString()
    @IsNotEmpty()
    name_ru: string
}
