import { Controller, Get, Post, Body, Param, Delete, Query, Put, Patch, UseGuards } from '@nestjs/common';
import { ShowcaseService } from './showcase.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { FilterShowcaseDto } from './dto/filterShowcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/guard/role.guard';
import { AuthGuard } from 'src/guard/auth.guard';

@ApiTags('Showcase')
@Controller('showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create showcase' })
  create(@Body() dto: CreateShowcaseDto) {
    return this.showcaseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all showcases with filter, pagination & sorting' })
  findAll(@Query() query: FilterShowcaseDto) {
    return this.showcaseService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one showcase by ID' })
  findOne(@Param('id') id: string) {
    return this.showcaseService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a showcase by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateShowcaseDto) {
    return this.showcaseService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a showcase by ID' })
  remove(@Param('id') id: string) {
    return this.showcaseService.remove(id);
  }
}