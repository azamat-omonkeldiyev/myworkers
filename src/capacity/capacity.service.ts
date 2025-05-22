import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CapacityService {
  constructor(private readonly prisma: PrismaService){}
  async create(data: CreateCapacityDto) {
    try {
      let cap = await this.prisma.capacity.findFirst({
        where: {
          OR: [
            { name_uz: data.name_uz },
            { name_ru: data.name_ru },
            { name_en: data.name_en},
          ],
        },
      });
      if(cap) throw new BadRequestException({message: "Capacity already exists!"})
        
      let newCap = await this.prisma.capacity.create({data})
      return newCap;
    } catch (error) {
      console.log(error)
      throw new BadRequestException({message: error.message})
    }
  }

  async findAll(params: {
    name?: string;
    page: number;
    limit: number;
    sortBy?: 'name' | 'id' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) {
    const { name, page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = params;
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
  
      const orderBy = {};
      if (sortBy === 'name') {
        orderBy['name_uz'] = sortOrder;
      } else {
        orderBy[sortBy] = sortOrder;
      }
  
      const data = await this.prisma.capacity.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      });
  
      const total = await this.prisma.capacity.count({ where });
  
      return {
        data,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findOne(id: string) {
    try {
      let capacity = await this.prisma.capacity.findFirst({where:{id}})
      if(!capacity){
        throw new NotFoundException({message: 'Capacity not found. Try again!'})
      }
      return capacity
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, data: UpdateCapacityDto) {
    try {
      await this.findOne(id)
      let capacity = await this.prisma.capacity.update({where:{id},data})
      return capacity
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let capacity = await this.prisma.capacity.delete({where:{id}})
      return capacity
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
}
