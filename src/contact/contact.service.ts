import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Prisma } from '@prisma/client';
import { FilterContactDto } from './dto/filterContact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    try {
      return await this.prisma.contact.create({ data: dto });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(filter: FilterContactDto) {
    const {
      search = '',
      page = 1,
      limit = 10,
      orderBy = 'createdAt',
      order = 'desc',
    } = filter;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.ContactWhereInput = {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { surName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ],
    };

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.contact.findMany({
          where,
          orderBy: { [orderBy]: order },
          skip,
          take: Number(limit),
        }),
        this.prisma.contact.count({ where }),
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
      const contact = await this.prisma.contact.findUnique({ where: { id } });
      if (!contact) throw new NotFoundException('Contact not found');
      return contact;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return this.prisma.contact.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
