import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService){}

  async create(createBasketDto: CreateBasketDto,userId: string) {
    try {
      const {
        productId,
        toolId,
        levelId,
        meansure,
        quantity,
      } = createBasketDto;
    
      let total = 0;
    
      if (productId && levelId) {
        const masterItem = await this.prisma.level.findFirst({
          where: {
            id:levelId,
          },
        });
    
        if (!masterItem) {
          throw new NotFoundException('MasterItem not found for given product and level');
        }
    
        if (meansure === 'HOUR') {
          console.log(masterItem.priceHourly)
          total = masterItem.priceHourly * quantity;
        } else if (meansure === 'DAY') {
          total = masterItem.priceDaily * quantity;
        }
      }
    
      if (toolId) {
        const tool = await this.prisma.tools.findUnique({
          where: { id: toolId },
        });
    
        if (!tool) {
          throw new NotFoundException({message: 'Tool not found'});
        }
    
        total = tool.price * quantity;
      }
    
      const basketItem = await this.prisma.basketItems.create({
        data: {
          productId,
          toolId,
          levelId,
          meansure,
          quantity,
          userId,
          total,
        },
        include:{
          product:true,
          level: true,
          tool: true,
          user: true
        }
      });
    
      return basketItem;
    } catch (error) {
      console.log(error)
      throw new BadRequestException({message: error.message})
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    productId?: string;
    toolId?: string;
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        productId,
        toolId,
      } = query;

      const skip = (page - 1) * limit;

      const where: any = {};
      if (productId) where.productId = productId;
      if (toolId) where.toolId = toolId;

      const [items, total] = await this.prisma.$transaction([
        this.prisma.basketItems.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: {
            user: true,
          },
        }),
        this.prisma.basketItems.count({ where }),
      ]);

      return {
        data: items,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
          limit,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findMyBasket(userId: string) {
    try {
      const baskets = await this.prisma.basketItems.findMany({
        where: { userId },
        include: {
          product: true,
          tool: true,
          level: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      return baskets;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Savatchani yuklashda xatolik yuz berdi');
    }
  }

  async findOne(id: string) {
    try {
      const item = await this.prisma.basketItems.findFirst({
        where: { id },
        include: {
          product: true,
          tool: true,
          level: true,
          user: true,
        },
      });
      if (!item) throw new NotFoundException(`Basket item with id ${id} not found`);
      return item;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateBasketDto: UpdateBasketDto) {
    try {
      await this.findOne(id)

      const updated = await this.prisma.basketItems.update({
        where: { id },
        data: updateBasketDto,
      });
      return updated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)

      let deleted = await this.prisma.basketItems.delete({ where: { id } });
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
