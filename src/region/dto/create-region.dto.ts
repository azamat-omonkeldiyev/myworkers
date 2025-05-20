import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRegionDto {
    @ApiProperty({example: "Toshkent"})
    @IsString()
    @IsNotEmpty()
    name_uz: string
    @ApiProperty({example: "Tashkent"})
    @IsString()
    @IsNotEmpty()
    name_en: string
    @ApiProperty({example: "Ташкент"})
    @IsString()
    @IsNotEmpty()
    name_ru: string
}
