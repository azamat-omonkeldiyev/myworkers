import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Roles(UserRole.ADMIN,UserRole.USERFIZ,UserRole.USERYUR)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createBasketDto: CreateBasketDto, @Req() req:Request) {
    let userId = req['user-id']
    return this.basketService.create(createBasketDto,userId);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  // @ApiOperation({ summary: 'Get all basket items with pagination, sorting and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by, e.g. createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order: asc or desc' })
  @ApiQuery({ name: 'productId', required: false, type: String, description: 'Filter by product ID' })
  @ApiQuery({ name: 'toolId', required: false, type: String, description: 'Filter by tool ID' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('productId') productId?: string,
    @Query('toolId') toolId?: string,
  ) {
    return this.basketService.findAll({ page, limit, sortBy, sortOrder, productId, toolId });
  }

  @UseGuards(AuthGuard)
  @Get('my')
  @ApiOperation({ summary: 'Foydalanuvchining savatchasini olish' })
  @ApiResponse({ status: 200, description: 'Basket maʼlumotlari muvaffaqiyatli qaytarildi' })
  async findMyBasket(@Req() req) {
    const userId = req['user-id'];
    return this.basketService.findMyBasket(userId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basketService.findOne(id);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN,UserRole.USERFIZ,UserRole.USERYUR)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBasketDto: UpdateBasketDto) {
    return this.basketService.update(id, updateBasketDto);
  }

  @Roles(UserRole.ADMIN,UserRole.USERFIZ,UserRole.USERYUR)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basketService.remove(id);
  }
}
