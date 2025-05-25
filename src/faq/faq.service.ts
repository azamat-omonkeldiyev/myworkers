import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { FilterFaqDto } from './dto/filter-faq.dto';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFaqDto, userId: string) {
    try {
      return this.prisma.fAQ.create({
        data: {
          question: dto.question,
          userId,
        },
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(filter: FilterFaqDto) {
    const { search, userId, page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.question = { contains: search, mode: 'insensitive' };
    }
    if (userId) {
      where.userId = userId;
    }

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.fAQ.findMany({
          where,
          include: { user: true },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.fAQ.count({ where }),
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
      const faq = await this.prisma.fAQ.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!faq) {
        throw new NotFoundException('FAQ not found');
      }

      return faq;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async update(id: string, dto: UpdateFaqDto) {
    try {
      await this.findOne(id);

      console.log(dto.answer);
      return this.prisma.fAQ.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return this.prisma.fAQ.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
