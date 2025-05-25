import {
  Controller,
  Get,
  Res,
  UseGuards,
  Header,
} from '@nestjs/common';
import { AdminExportService } from './admin-export.service';
import { Response } from 'express';
import { Workbook } from 'exceljs';
import { Roles } from 'src/user/decorators/role.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { UserRole } from '@prisma/client';

@Controller('admin-export')
@Roles(UserRole.ADMIN)
@UseGuards(RoleGuard)
@UseGuards(AuthGuard)
export class AdminExportController {
  constructor(private readonly exportService: AdminExportService) {}

  private async generateExcel(res: Response, sheetName: string, data: any[], fileName: string) {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet(sheetName);
    if (data.length > 0) {
      sheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key: key,
        width: 25,
      }));
      sheet.addRows(data);
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  }

  @Get('users')
  async exportUsers(@Res() res: Response) {
    const data = await this.exportService.getUsers();
    return this.generateExcel(res, 'Users', data, 'users');
  }

  @Get('masters')
  async exportMasters(@Res() res: Response) {
    const data = await this.exportService.getMasters();
    return this.generateExcel(res, 'Masters', data, 'masters');
  }

  @Get('tools')
  async exportTools(@Res() res: Response) {
    const data = await this.exportService.getTools();
    return this.generateExcel(res, 'Tools', data, 'tools');
  }

  @Get('products')
  async exportProducts(@Res() res: Response) {
    const data = await this.exportService.getProducts();
    return this.generateExcel(res, 'Products', data, 'products');
  }

  @Get('orders')
  async exportOrders(@Res() res: Response) {
    const data = await this.exportService.getOrders();
    return this.generateExcel(res, 'Orders', data, 'orders');
  }
}
