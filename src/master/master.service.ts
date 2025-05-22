import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MasterService {
  constructor(private readonly prisma:PrismaService){}
  async create(dto: CreateMasterDto) {
    const { masterItems, ...masterData } = dto;

    try {
      const createdMaster = await this.prisma.master.create({
        data: {
          ...masterData,
          isActive: true,
        },
      });

      for (const item of masterItems) {
        const { productId, levelId, minWorkingHours, priceHourly, priceDaily } = item;

        await this.prisma.masterItems.create({
          data: {
            masterId: createdMaster.id,
            productId,
            levelId,
            minWorkingHours,
            priceHourly,
            priceDaily,
          },
        });
      }

      return this.prisma.master.findFirst({
        where: { id: createdMaster.id },
        include: {
          MasterItems: {
            include: {
              level: true,
              product: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isActive?: boolean;
    levelId?: string;
    productId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isActive,
      levelId,
      productId,
    } = query;
  
    const where: any = {};
  
    if (search) {
      where.fullname = { contains: search, mode: 'insensitive' };
    }
  
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
  
    if (levelId || productId) {
      where.MasterItems = {
        some: {
          ...(levelId && { levelId }),
          ...(productId && { productId }),
        },
      };
    }
  
    const total = await this.prisma.master.count({ where });
  
    const masters = await this.prisma.master.findMany({
      where,
      skip: (page - 1) * limit,
      take: +limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  
    return {
      total,
      page,
      limit,
      data: masters,
    };
  }
  

  async findOne(id: string) {
    const master = await this.prisma.master.findUnique({
      where: { id },
      include: {
        MasterItems: {
          include: {
            product: true,
            level: true,
          },
        },
        OrderMaster: {
          include:{ order: true}
        },
        Star: true,
      },
    });
  
    if (!master) {
      throw new NotFoundException(`Master with id ${id} not found`);
    }
  
    const starCount = master.Star.length;
    const averageStar = starCount
      ? master.Star.reduce((sum, s) => sum + s.star, 0) / starCount
      : null;
  
    return {
      ...master,
      averageStar: averageStar ? +averageStar.toFixed(2) : null,
    };
  }
  
  async update(id: string, dto: UpdateMasterDto) {
    const { masterItems, ...masterData } = dto;

    const master = await this.prisma.master.findUnique({ where: { id } });
    if (!master) throw new NotFoundException(`Master with id ${id} not found`);

    await this.prisma.master.update({
      where: { id },
      data: masterData,
    });

    if (masterItems && masterItems.length > 0) {
      await this.prisma.masterItems.deleteMany({ where: { masterId: id } });

      for (const item of masterItems) {
        await this.prisma.masterItems.create({
          data: {
            masterId: id,
            productId: item.productId,
            levelId: item.levelId,
            minWorkingHours: item.minWorkingHours,
            priceHourly: item.priceHourly,
            priceDaily: item.priceDaily,
          },
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const master = await this.prisma.master.findUnique({ where: { id } });
    if (!master) throw new NotFoundException(`Master with id ${id} not found`);

    await this.prisma.masterItems.deleteMany({ where: { masterId: id } });
    await this.prisma.master.delete({ where: { id } });

    return { message: `Master with id ${id} deleted successfully` };
  }
}
