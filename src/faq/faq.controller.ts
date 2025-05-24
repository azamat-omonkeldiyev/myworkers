import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FilterFaqDto } from './dto/filter-faq.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('FAQ')
@ApiBearerAuth()
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create FAQ' })
  create(@Body() dto: CreateFaqDto, @Req() req: any) {
    const userId = req['user-id'];
    return this.faqService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all FAQs with optional filters' })
  findAll(@Query() query: FilterFaqDto) {
    return this.faqService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single FAQ by ID' })
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update FAQ by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.faqService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete FAQ by ID' })
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
