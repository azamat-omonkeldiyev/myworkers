import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LevelService {
  constructor(private readonly prisma: PrismaService){}

  async create(data: CreateLevelDto) {
    try {
      let level = await this.prisma.level.findFirst({
        where: {
          OR: [
            { name_uz: data.name_uz },
            { name_ru: data.name_ru },
            { name_en: data.name_en },
          ],
        },
      });

      console
      if(level) throw new BadRequestException({message: "level already exists!"})
        
     
      let newLevel = await this.prisma.level.create({data})
      return newLevel;
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
  
      const data = await this.prisma.level.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      });
  
      const total = await this.prisma.level.count({ where });
  
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
      let level = await this.prisma.level.findFirst({where:{id}})
      if(!level){
        throw new NotFoundException({message: 'Level not found. Try again!'})
      }
      return level
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, data: UpdateLevelDto) {
    try {
      await this.findOne(id)
      let level = await this.prisma.level.update({where:{id},data})
      return level
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let level = await this.prisma.level.delete({where:{id}})
      return level
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
}
}
