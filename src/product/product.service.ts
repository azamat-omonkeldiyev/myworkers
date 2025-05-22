import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private async validateIds(
    ids: string[],
    model: 'tools' | 'level',
  ): Promise<void> {
    try {
      let found: { id: string }[] = [];

      if (model === 'tools') {
        found = await this.prisma.tools.findMany({
          where: { id: { in: ids } },
          select: { id: true },
        });
      } else if (model === 'level') {
        found = await this.prisma.level.findMany({
          where: { id: { in: ids } },
          select: { id: true },
        });
      }

      const foundIds = found.map((item) => item.id);
      const notFound = ids.filter((id) => !foundIds.includes(id));

      if (notFound.length > 0) {
        throw new BadRequestException(
          `Quyidagi ${model} ID lar topilmadi: ${notFound.join(', ')}`,
        );
      }
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async create(dto: CreateProductDto) {
    const { toolIds, levelIds, ...rest } = dto;

    try {

      let product = await this.prisma.product.findFirst({
        where: {
          OR: [
            { name_uz: rest.name_uz },
            { name_ru: rest.name_uz },
            { name_en: rest.name_uz },
          ],
        },
      });
      let prds = await this.prisma.product.findMany()
      console.log(product)
      console.log(prds, '<= data all')
      if(product) throw new BadRequestException({message: "Product already exists!"})
        

      await this.validateIds(toolIds, 'tools');
      await this.validateIds(levelIds, 'level');

      return this.prisma.product.create({
        data: {
          ...rest,
          isActive: true,
          tools: {
            connect: toolIds.map((id) => ({ id })),
          },
          levels: {
            connect: levelIds.map((id) => ({ id })),
          },
        },
        include: {
          tools: true,
          levels: true,
        },
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'name_uz' | 'id' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    levelId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      levelId,
    } = params;

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { name_uz: { contains: search, mode: 'insensitive' } },
          { name_en: { contains: search, mode: 'insensitive' } },
          { name_ru: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (levelId) {
      where.AND.push({
        levels: { some: { id: levelId } },
      });
    }

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            tools: true,
            levels: true,
          },
        }),
        this.prisma.product.count({ where }),
      ]);

      console.log(data,'<=data')
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
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        tools: true,
        levels: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    try {
      const { toolIds, levelIds, ...rest } = dto;

      await this.findOne(id);
      if (toolIds) {
        await this.validateIds(toolIds, 'tools');
      }
      if (levelIds) {
        await this.validateIds(levelIds, 'level');
      }

      return this.prisma.product.update({
        where: { id },
        data: {
          ...rest,
          tools: { set: toolIds?.map((id) => ({ id })) },
          levels: { set: levelIds?.map((id) => ({ id })) },
        },
        include: {
          tools: true,
          levels: true,
        },
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.prisma.masterItems.deleteMany({
        where: { productId: id },
      });
      await this.prisma.orderItems.deleteMany({
        where: { productId: id },
      });
      return this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
