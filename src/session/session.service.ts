import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(userId: string) {
    try {
      return await this.prisma.sessions.findMany({
        where: { userId },
        include: {user: true}
      });
    } catch (error) {
      throw new BadRequestException({message:error.message});
    }
  }

  
  async remove(id: string) {
    try {
      return await this.prisma.sessions.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException({message:error.message});
    }
  }
}
