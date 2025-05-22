import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    const { orderItems, orderTools, ...orderData } = dto;

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            ...orderData,
            userId,
            status: OrderStatus.ACTIVE,
            total: 0,
          },
        });

        let totalPrice = 0;
        if (orderItems) {
          for (const item of orderItems) {
            const level = await tx.level.findUnique({
              where: { id: item.levelId },
            });

            if (!level) {
              throw new BadRequestException(`Level not found: ${item.levelId}`);
            }

            const count = item.meansureCount ?? 1;
            const rate =
              item.meansure === 'HOUR' ? level.priceHourly : level.priceDaily;
            const itemTotal = rate * count * item.quantity;

            totalPrice += itemTotal;

            await tx.orderItems.create({
              data: {
                orderId: newOrder.id,
                productId: item.productId,
                levelId: item.levelId,
                quantity: item.quantity,
                meansure: item.meansure,
                meansureCount: count,
              },
            });
          }
        }

        if (orderTools) {
          for (const tool of orderTools) {
            const toolData = await tx.tools.findUnique({
              where: { id: tool.toolsId },
            });

            if (!toolData) {
              throw new BadRequestException(`Tool not found: ${tool.toolsId}`);
            }

            if (toolData.quantity < tool.count) {
              throw new BadRequestException(
                `Tool '${toolData.name_uz}' has only ${toolData.quantity} units, but ${tool.count} requested.`,
              );
            }

            const toolTotal = toolData.price * tool.count;
            totalPrice += toolTotal;

            await tx.orderTools.create({
              data: {
                orderId: newOrder.id,
                toolsId: tool.toolsId,
                count: tool.count,
                total: toolTotal,
              },
            });

            await tx.tools.update({
              where: { id: tool.toolsId },
              data: {
                quantity: {
                  decrement: tool.count,
                },
              },
            });
          }
        }

        await tx.basketItems.deleteMany({
          where: { userId: orderData.userId },
        });

        await tx.order.update({
          where: { id: newOrder.id },
          data: {
            total: totalPrice,
          },
        });

        const finalOrder = await tx.order.findUnique({
          where: { id: newOrder.id },
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

        return finalOrder;
      });
      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestException({ message: error.message });
    }
  }

  async assignMastersToOrder(orderId: string, masterIds: string[]) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException({ message: 'Order not found' });
      }

      for (const masterId of masterIds) {
        let master = await this.prisma.master.findFirst({
          where: { id: masterId },
        });
        if (!master)
          throw new NotFoundException({
            message: `${masterId} not found in masters!`,
          });
        const exists = await this.prisma.orderMaster.findFirst({
          where: {
            orderId,
            masterId,
          },
        });

        if (!exists) {
          await this.prisma.orderMaster.create({
            data: {
              orderId,
              masterId,
            },
          });
        }
      }

      return { message: 'Masters successfully connected to order' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException({ message: error.message });
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    sortBy?: 'date' | 'total' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    userId?: string;
  }) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        userId,
      } = query;

      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (status) where.status = status;
      if (userId) where.userId = userId;

      const [orders, totalCount] = await this.prisma.$transaction([
        this.prisma.order.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        this.prisma.order.count({ where }),
      ]);

      return {
        data: orders,
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async findMyOrder(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
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
          OrderMaster: {
            include: {
              master: {
                include: {
                  MasterItems: true, // 👈 bu yerda
                },
              },
            },
          },
          Comment: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return orders;
    } catch (error) {
      console.error(error);
      throw new BadRequestException({ message: error.message });
    }
  }

  async findOne(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
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
          OrderMaster: {
            include: {
              master: {
                include: {
                  MasterItems: true, // 👈 bu yerda
                },
              },
            },
          },
          Comment: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException({ message: 'Buyurtma topilmadi' });
      }

      return order;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async update(id: string, dto: UpdateOrderDto) {
    try {
      await this.findOne(id);
      const updated = await this.prisma.order.update({
        where: { id },
        data: dto,
      });

      return updated;
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      const orderToDelete = await this.prisma.order.findFirst({
        where: { id },
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
          Comment: true,
        },
      });

      if (!orderToDelete) {
        throw new BadRequestException('Order topilmadi');
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.orderTools.deleteMany({
          where: { orderId: id },
        });

        await tx.orderItems.deleteMany({
          where: { orderId: id },
        });

        await tx.comment.deleteMany({
          where: { orderId: id },
        });

        await tx.order.delete({
          where: { id },
        });
      });

      return {
        deletedOrder: orderToDelete,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException({ message: error.message });
    }
  }
}
