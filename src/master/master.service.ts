import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMasterDto } from './dto/create-master.dto';
import { UpdateMasterDto } from './dto/update-master.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TelegramService } from 'src/bot/bot.service';

@Injectable()
export class MasterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bot: TelegramService,
  ) {}
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
        const { productId, levelId, minWorkingHours, priceHourly, priceDaily } =
          item;

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

      let newMaster = await this.prisma.master.findFirst({
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
      if (!newMaster) return newMaster;
      let masterInfo = newMaster?.MasterItems.map((item, index) => {
        return `🔹 ${index + 1}) ${item.product.name_uz} - ${item.level.name_uz}
        🕒 Minimal soat: ${item.minWorkingHours}
        💰 Soatlik: ${item.priceHourly} so'm
        📅 Kunlik: ${item.priceDaily} so'm`;
      }).join('\n');

      let message = `
      👷‍♂️ Yangi Usta Qo‘shildi!
      🆔 ID: ${newMaster?.id}
      📛 Ism: ${newMaster?.fullname || 'Noma’lum'}
      
      🛠 Mutaxassisligi:
      ${masterInfo || 'Ma’lumot yo‘q'}
      
      🕒 Qo‘shilgan sana: ${new Date(newMaster.createdAt).toLocaleString('uz-UZ')}
      `;

      await this.bot.sendMessageToUser(message.trim());

      return newMaster;
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

    try {
      const masters = await this.prisma.master.findMany({
        where,
        skip: (page - 1) * limit,
        take: +limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          MasterItems: {
            include: {
              product: true,
              level: true,
            },
          },
        },
      });

      return {
        total,
        page,
        limit,
        data: masters,
      };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findOne(id: string) {
    try {
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
            include: { order: true },
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
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async update(id: string, dto: UpdateMasterDto) {
    const { masterItems, ...masterData } = dto;

    try {
      const master = await this.prisma.master.findUnique({ where: { id } });
      if (!master)
        throw new NotFoundException(`Master with id ${id} not found`);

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
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      const master = await this.prisma.master.findUnique({ where: { id } });
      if (!master)
        throw new NotFoundException(`Master with id ${id} not found`);

      let deleted = await this.prisma.$transaction([
        this.prisma.star.deleteMany({ where: { masterId: id } }),
        this.prisma.orderMaster.deleteMany({ where: { masterId: id } }),
        this.prisma.masterItems.deleteMany({ where: { masterId: id } }),
        this.prisma.master.delete({ where: { id } }),
      ]);

      return deleted[3];
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
