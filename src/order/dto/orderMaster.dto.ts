import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class AssignMastersDto {
    @ApiProperty({example:'order-uuid'})
    @IsUUID()
    orderId: string;
  
    @ApiProperty({example:['master-uuid','master-2-uuid']})
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("all", { each: true })
    masterIds: string[];
  }
  