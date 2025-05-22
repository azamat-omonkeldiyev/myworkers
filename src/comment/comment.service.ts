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

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
