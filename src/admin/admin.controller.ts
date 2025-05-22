import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { CreateAdminrDto } from 'src/user/dto/createAdmin.dto';
import { UserService } from 'src/user/user.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  // @Roles(UserRole.ADMIN)
  // @UseGuards(RoleGuard)
  // @UseGuards(AuthGuard)
  @Post()
  createAdmin(@Body() dto: CreateAdminrDto) {
    return this.userService.createAdmin(dto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteAdmin(@Param('id') id: string) {
    return this.userService.deleteAdmin(id);
  }
}
