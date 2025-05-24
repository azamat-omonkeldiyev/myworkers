import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { FilterShowcaseDto } from './dto/filterShowcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';

@Injectable()
export class ShowcaseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateShowcaseDto) {
    try {
      return this.prisma.showcase.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: FilterShowcaseDto) {
    const {
      page = 1,
      limit = 10,
      search,
      orderBy = 'createdAt',
      order = 'desc',
    } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = search
      ? {
          OR: [
            { name_uz: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
            { name_ru: { contains: search, mode: 'insensitive' } },
            { description_uz: { contains: search, mode: 'insensitive' } },
            { description_en: { contains: search, mode: 'insensitive' } },
            { description_ru: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.showcase.findMany({
          where,
          orderBy: { [orderBy]: order },
          skip,
          take: Number(limit),
        }),
        this.prisma.showcase.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findOne(id: string) {
    try {
      const showcase = await this.prisma.showcase.findUnique({ where: { id } });
      if (!showcase)
        throw new NotFoundException({ message: 'Showcase not found' });
      return showcase;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async update(id: string, dto: UpdateShowcaseDto) {
    try {
      await this.findOne(id);
      return this.prisma.showcase.update({ where: { id }, data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return this.prisma.showcase.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
