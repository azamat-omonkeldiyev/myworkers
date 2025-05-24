import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MyDataService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserWithRegion(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { region: true },
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        OrderItems: {
          include: {
            product: true,
            level: true,
          },
        },
        OrderTools: {
          include: {
            tool: true,
          },
        },
      },
    });
  }
}
