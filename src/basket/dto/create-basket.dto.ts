import { ApiProperty } from "@nestjs/swagger";
import { meansureEnum } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class CreateBasketDto {
    @ApiProperty({example: 'product-uuid'})
    @IsUUID()
    @IsOptional()
    productId: string

    userId: string

    @ApiProperty({example: 'level-uuid'})
    @IsUUID()
    @IsOptional()
    levelId: string

    @ApiProperty({example: 'tool-uuid'})
    @IsUUID()
    @IsOptional()
    toolId: string

    @ApiProperty({example: 8})
    @IsNumber()
    @IsNotEmpty()
    quantity: number

    @ApiProperty({enum: meansureEnum,example: meansureEnum.HOUR})
    @IsEnum(meansureEnum)
    meansure: meansureEnum

    total: number
}
