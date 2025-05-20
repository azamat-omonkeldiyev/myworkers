import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateRegionDto) {
    try {
      let newRegion = await this.prisma.region.create({data})
      return newRegion;
    } catch (error) {
      console.log(error)
      throw new BadRequestException({message: error.message})
    }
  }

  async findAll(params: {
    name?: string;
    page: number;
    limit: number;
  }) {
    const { name, page, limit } = params;
    const skip = (page - 1) * limit;

    try {
      const where: any = {};
      
      if (name) {
        where.OR = [
          { name_uz: { contains: name, mode: 'insensitive' } },
          { name_en: { contains: name, mode: 'insensitive' } },
          { name_ru: { contains: name, mode: 'insensitive' } },
        ];
      }

      const data = await this.prisma.region.findMany({
        where,
        skip,
        take: limit,
      });

      const total = await this.prisma.region.count({ where });

      return {
        data,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async findOne(id: string) {
    try {
      let region = await this.prisma.region.findFirst({where:{id}})
      if(!region){
        throw new NotFoundException({message: 'Region not found. Try again!'})
      }
      return region
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, data: UpdateRegionDto) {
    try {
      this.findOne(id)
      let region = await this.prisma.region.update({where:{id},data})
      return region
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async remove(id: string) {
    try {
      this.findOne(id)
      let region = await this.prisma.region.delete({where:{id}})
      return region
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
}
