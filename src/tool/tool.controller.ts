import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ToolService } from './tool.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('tool')
export class ToolController {
  constructor(private readonly toolService: ToolService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolService.create(createToolDto);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'capacityId', required: false, type: String })
  @ApiQuery({ name: 'brandId', required: false, type: String })
  @ApiQuery({ name: 'sizeId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: [ 'name' , 'id' , 'price' , 'createdAt' , 'code'],
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  findAll(
    @Query('name') name?: string,
    @Query('capacityId') capacityId?: string,
    @Query('sizeId') sizeId?: string,
    @Query('brandId') brandId?: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
    @Query('sortBy') sortBy?:  'name' | 'id' | 'price' | 'createdAt' | 'code',
    @Query('sortOrder') sortOrder?: 'asc'| 'desc'
  ) {
    const page = Number(pageStr) || 1;
    const limit = Number(limitStr) || 10;
    return this.toolService.findAll({page,limit,name,sortBy,sortOrder,sizeId,brandId,capacityId});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolService.findOne(id);
  }

  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolService.update(id, updateToolDto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolService.remove(id);
  }
}
