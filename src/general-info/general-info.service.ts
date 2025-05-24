import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGeneralInfoDto } from './dto/create-general-info.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { Prisma } from '@prisma/client';
import { FilterGeneralInfoDto } from './dto/filterGeneralInfo.dto';

@Injectable()
export class GeneralInfoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGeneralInfoDto) {
    try {
      return await this.prisma.generalInfo.create({ data: dto });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(filter: FilterGeneralInfoDto) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      order = 'desc',
      search = '',
    } = filter;

    const skip = (Number(page) - 1) * Number(limit);

    let where: any = {}
    if(search){
      where = {
        OR: [
          { email: { has: search } },
          { phones: { has: search } },
          { links: { has: search } },
        ],
      };
    }

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.generalInfo.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: {
            [orderBy]: order,
          },
        }),
        this.prisma.generalInfo.count({ where }),
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
      const record = await this.prisma.generalInfo.findUnique({
        where: { id },
      });
  
      if (!record) {
        throw new NotFoundException('GeneralInfo not found');
      }
  
      return record;
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, dto: UpdateGeneralInfoDto) {
    try {
      await this.findOne(id);
      return this.prisma.generalInfo.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return this.prisma.generalInfo.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
