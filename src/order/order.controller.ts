import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AssignMastersDto } from './dto/orderMaster.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { OrderStatus, UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guard/auth.guard';
import { Request } from 'express';
import { Roles } from 'src/user/decorators/role.decorator';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req:Request) {
    let userId = req['user-id']
    return this.orderService.create(createOrderDto,userId);
  }

  @Post('assign-masters')
  async assignMasters(@Body() dto: AssignMastersDto) {
    return this.orderService.assignMastersToOrder(dto.orderId, dto.masterIds);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN, UserRole.VIEWERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'userId', required: false, type: String})
  @ApiQuery({ name: 'orderstatus', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['date' , 'total' , 'createdAt'] })
  findAll(@Query() query:any) {
    return this.orderService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('my')
  @ApiOperation({ summary: 'Foydalanuvchining buyurtmalarini olish' })
  @ApiResponse({ status: 200, description: 'Order maʼlumotlari muvaffaqiyatli qaytarildi' })
  async findMyBasket(@Req() req) {
    const userId = req['user-id'];
    return this.orderService.findMyOrder(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @UseGuards(AuthGuard)  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
