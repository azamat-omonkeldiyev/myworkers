import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class sendOtpEmailDto {
    @IsEmail()
    @ApiProperty({ example: 'alexBek@gmail.com' })
    email: string;
}
