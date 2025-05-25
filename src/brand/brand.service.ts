import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TelegramService } from 'src/bot/bot.service';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService,
    private readonly bot: TelegramService
  ){}
  async create(data: CreateBrandDto) {
    try {
      let brand = await this.prisma.brand.findFirst({
        where: {
          OR: [
            { name_uz: data.name_uz },
            { name_ru: data.name_ru },
            { name_en: data.name_en },
          ],
        },
      });
      if(brand) throw new BadRequestException({message: "Brand already exists!"})
        
      let newBrand = await this.prisma.brand.create({data})
      let result = await this.bot.sendMessageToUser('salom')
      console.log(result)
      return newBrand;
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
  
      const data = await this.prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      });
  
      const total = await this.prisma.brand.count({ where });
  
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
      let brand = await this.prisma.brand.findFirst({where:{id}})
      if(!brand){
        throw new NotFoundException({message: 'Brand not found. Try again!'})
      }
      return brand
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, data: UpdateBrandDto) {
    try {
      await this.findOne(id)
      let brand = await this.prisma.brand.update({where:{id},data})
      return brand
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      let brand = await this.prisma.brand.delete({where:{id}})
      return brand
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
}
