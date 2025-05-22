import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToolService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateToolDto) {
    try {

      let tool = await this.prisma.tools.findFirst({
        where: {
          OR: [
            { name_uz: data.name_uz },
            { name_ru: data.name_ru },
            { name_en: data.name_en },
          ],
        },
      });
      if(tool) throw new BadRequestException({message: "tool already exists!"})

      let code = Math.floor(100000 + Math.random() * 900000);

      let capacity = await this.prisma.capacity.findFirst({
        where: { id: data.capacityId },
      });
      if (!capacity)
        throw new NotFoundException({ message: 'capacity not found' });

      let size = await this.prisma.size.findFirst({
        where: { id: data.sizeId },
      });
      if (!size)
        throw new NotFoundException({ message: 'Size not found' });

      let brand = await this.prisma.brand.findFirst({
        where: { id: data.brandId },
      });
      if (!brand)
        throw new NotFoundException({ message: 'brand not found' });
      
      let newTool = await this.prisma.tools.create({ data:{...data, code} });
      return newTool;
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(params: {
    name?: string;
    capacityId?:string;
    brandId?: string;
    sizeId?:string;
    page: number;
    limit: number;
    sortBy?: 'name' | 'id' | 'price' | 'createdAt' | 'code';
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      name,
      capacityId,
      sizeId,
      brandId,
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
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
      
      if(capacityId) where.capacityId = capacityId

      if(sizeId) where.sizeId = sizeId

      if(brandId) where.brandId = brandId

      const orderBy = {};
      if (sortBy === 'name') {
        orderBy['name_uz'] = sortOrder;
      } else {
        orderBy[sortBy] = sortOrder;
      }

      const data = await this.prisma.tools.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include:{capacity: true, size:true, brand:true}
      });

      const total = await this.prisma.tools.count({ where });

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
      let tool = await this.prisma.tools.findFirst({ where: { id },include:{capacity: true, size:true,brand:true} });
      if (!tool) {
        throw new NotFoundException({ message: 'Tool not found. Try again!' });
      }
      return tool;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async update(id: string, data: UpdateToolDto) {
    try {
      await this.findOne(id);
      let capacity = await this.prisma.capacity.findFirst({
        where: { id: data.capacityId },
      });
      if (!capacity)
        throw new NotFoundException({ message: 'capacity not found' });

      let size = await this.prisma.size.findFirst({
        where: { id: data.sizeId },
      });
      if (!size)
        throw new NotFoundException({ message: 'Size not found' });

      let brand = await this.prisma.brand.findFirst({
        where: { id: data.brandId },
      });
      if (!brand)
        throw new NotFoundException({ message: 'brand not found' });
      
      let tool = await this.prisma.tools.update({ where: { id }, data });
      return tool;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      let tool = await this.prisma.tools.delete({ where: { id } });
      return tool;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
