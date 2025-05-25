import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService){}


  async create(createCommentDto: CreateCommentDto, userId: string) {
    const { orderId, message, star } = createCommentDto;

    try {
      const order = await this.prisma.order.findFirst({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException({message: 'Order not found'});
      }

      const comment = await this.prisma.comment.create({
        data: {
          orderId,
          userId,
          message,
        },
      });


      const createdStars: any = [];
     if(star){
      for (const s of star) {
        const master = await this.prisma.master.findFirst({
          where: { id: s.masterId },
        });

        if (!master) {
          throw new NotFoundException({message: `Master with id ${s.masterId} not found`});
        }

        let newStar = await this.prisma.star.create({
          data: {
            masterId: s.masterId,
            userId,
            star: s.star,
          },
        });
        createdStars.push(newStar);
      }
     }

      return {
        comment,
        createdStars
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException({message:error.message});
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
    userId?: string;
    orderId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      orderBy = 'createdAt',
      order = 'desc',
      userId,
      orderId,
    } = query;
  
    const where: any = {};
  
    if (search) {
      where.message = { contains: search, mode: 'insensitive' };
    }
  
    if (userId) {
      where.userId = userId;
    }
  
    if (orderId) {
      where.orderId = orderId;
    }
  
    try {
      const [comments, total] = await this.prisma.$transaction([
        this.prisma.comment.findMany({
          where,
          orderBy: { [orderBy]: order },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
            order: true,
          },
        }),
        this.prisma.comment.count({ where }),
      ]);
    
      return {
        data: comments,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
  

  async findOne(id: string) {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
        include: {
          user: true,
          order: true,
        },
      });
  
      if (!comment) {
        throw new NotFoundException({ message: 'Comment not found' });
      }
  
      return comment;
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      await this.findOne(id);
      return this.prisma.comment.update({
        where: { id },
        data: updateCommentDto,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException({ message: error.message });
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return this.prisma.comment.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
}
