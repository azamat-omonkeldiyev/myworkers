import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SizeService {
  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateSizeDto) {
    try {
      let size = await this.prisma.size.findFirst({
        where: {
          OR: [
            { name_uz: data.name_uz },
            { name_ru: data.name_ru },
            { name_en: data.name_en },
          ],
        },
      });
      if(size) throw new BadRequestException({message: "Size already exists!"})
        
      let newSize = await this.prisma.size.create({data})
      return newSize;
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
  
      const data = await this.prisma.size.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      });
  
      const total = await this.prisma.size.count({ where });
  
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
      let size = await this.prisma.size.findFirst({where:{id}})
      if(!size){
        throw new NotFoundException({message: 'Size not found. Try again!'})
      }
      return size
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, data: UpdateSizeDto) {
    try {
      await this.findOne(id)
      let size = await this.prisma.size.update({where:{id},data})
      return size
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let size = await this.prisma.size.delete({where:{id}})
      return size
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
}
}
