import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GeneralInfoService } from './general-info.service';
import { CreateGeneralInfoDto } from './dto/create-general-info.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FilterGeneralInfoDto } from './dto/filterGeneralInfo.dto';

@Controller('general-info')
export class GeneralInfoController {
  constructor(private readonly generalInfoService: GeneralInfoService) {}

  @Post()
  create(@Body() createGeneralInfoDto: CreateGeneralInfoDto) {
    return this.generalInfoService.create(createGeneralInfoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all general info with filtering, sorting and pagination' })
  findAll(@Query() filterDto: FilterGeneralInfoDto) {
    return this.generalInfoService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalInfoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneralInfoDto: UpdateGeneralInfoDto) {
    return this.generalInfoService.update(id, updateGeneralInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalInfoService.remove(id);
  }
}
