import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshtoken.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { LoginUserDto } from './dto/loginUser.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ){}

  genAccToken(payload:{id:string, role:string}):string{
    return this.jwt.sign(payload,{expiresIn:'15m'})
  }

  generateRefreshToken(payload:{id:string,role:string}):string {
    return this.jwt.sign(payload,{
      secret: process.env.TOKEN_KEY_REFRESH,
      expiresIn: '7d'
    })
  }

  async checkPhone(phone: string) {
    try {
      let user = this.prisma.user.findFirst({ where: { phone } });
      return user;
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }

  async checkEmail(email: string) {
    try {
      let user = this.prisma.user.findFirst({ where: { email } });
      return user;
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }

  
  verifyRefreshToken(tokenDto: RefreshTokenDto) {
    try {
      const data = this.jwt.verify(tokenDto.token, {
        secret: process.env.TOKEN_KEY_REFRESH,
      });
      const payload = { id: data.id, role: data.role };
      const accessToken = this.genAccToken(payload);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }

  async register(data: CreateUserDto) {
    try {
      let user = await this.checkEmail(data.email);
      if(user){
        throw new BadRequestException({message: "Email already exists!"})
      }
      
      let phone = await this.checkPhone(data.phone)
      if(phone){
        throw new BadRequestException({message: "Phone number already exists!"})
      }

      let region = await this.prisma.region.findFirst({where:{id:data.regionId}})
      if(!region){
        throw new NotFoundException({message: "Region not found!"})
      }

      let hash = bcrypt.hashSync(data.password, 10)
      let newUser= await this.prisma.user.create({
        data: {...data, password: hash}
      })
      return newUser;
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async login(data: LoginUserDto) {
    try {
      let user = await this.checkEmail(data.email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Wrong creadentials!');
      }
      let payload = { id: user.id, role: user.role };
      let accessToken = this.genAccToken(payload);
      let refreshToken = this.generateRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
