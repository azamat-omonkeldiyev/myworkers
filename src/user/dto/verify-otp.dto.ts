import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class verifyOtpDto {
    @IsEmail()
    @ApiProperty({ example: 'ahmadjon@gmail.com' })
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(6)
    @ApiProperty({ example: '201245' })
    otp: string;
}
