import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminExportService {
  constructor(private readonly prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany({
      include: {
        region: true,
      },
    });
  }

  getMasters() {
    return this.prisma.master.findMany();
  }

  getTools() {
    return this.prisma.tools.findMany({
      include: {
        brand: true,
        capacity: true,
        size: true,
      },
    });
  }

  getProducts() {
    return this.prisma.product.findMany();
  }

  getOrders() {
    return this.prisma.order.findMany({
      include: {
        user: true,
      },
    });
  }
}
