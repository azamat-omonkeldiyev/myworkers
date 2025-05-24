import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { FilterPartnerDto } from './dto/filter-partner.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePartnerDto) {
    try {
    return this.prisma.partners.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async findAll(query: FilterPartnerDto) {
    const {
      page = 1,
      limit = 10,
      search,
      orderBy = 'createdAt',
      order = 'desc',
    } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.PartnersWhereInput = search
      ? {
          OR: [
            { name_uz: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
            { name_ru: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.partners.findMany({
          where,
          orderBy: { [orderBy]: order },
          skip,
          take: Number(limit),
        }),
        this.prisma.partners.count({ where }),
      ]);
  
      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async findOne(id: string) {
    try {
      const partner = await this.prisma.partners.findUnique({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, dto: UpdatePartnerDto) {
    try {
      await this.findOne(id);
    return this.prisma.partners.update({ where: { id }, data: dto });
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return this.prisma.partners.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
}
