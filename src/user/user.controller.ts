import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { RefreshTokenDto } from './dto/refreshtoken.dto';
import { sendOtpEmailDto } from './dto/sendOtpEmail.dto';
import { verifyOtpDto } from './dto/verify-otp.dto';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @Post('sentOtpEmail')
  sentOtp(@Body() data: sendOtpEmailDto) {
    return this.userService.sentOtpEmail(data);
  }
  
  @Post('verifyOtp')
  checkOtp(@Body() data: verifyOtpDto) {
    return this.userService.verifyOtp(data);
  }
  
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  login(@Body() data: LoginUserDto, @Req() req: Request) {
    return this.userService.login(data,req);
  }

  @Post('refreshToken')
  refreshToken(@Body() data: RefreshTokenDto) {
    return this.userService.verifyRefreshToken(data);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'fullname', required: false, type: String})
  @ApiQuery({ name: 'email', required: false, type: String})
  @ApiQuery({ name: 'phone', required: false, type: String })
  @ApiQuery({ name: 'regionId', required: false, type: String})
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'sortBy', required: false, type: String})
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get("/me")
  me(@Req() req:Request) {
    const userId = req['user-id'];
    return this.userService.me(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  
}
