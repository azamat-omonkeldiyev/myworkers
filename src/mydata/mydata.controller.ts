import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { MyDataService } from './mydata.service';
import * as ExcelJS from 'exceljs';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('mydata')
export class MyDataController {
  constructor(private readonly myDataService: MyDataService) {}

  @UseGuards(AuthGuard)
  @Get('export/user-excel')
  async exportUserExcel(@Req() req: Request, @Res() res: Response) {
    const userId = req['user-id'];
    const user = await this.myDataService.getUserWithRegion(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('User Data');

    worksheet.addRow([
      'Full Name', 'Email', 'Phone', 'Address', 'Region', 'Role',
      'INN', 'MFO', 'RC', 'Bank', 'OKED', 'Created At'
    ]);
    worksheet.addRow([
      user.fullname,
      user.email,
      user.phone ?? '',
      user.address ?? '',
      user.region?.name_uz ?? '',
      user.role,
      user.INN ?? '',
      user.MFO ?? '',
      user.RC ?? '',
      user.Bank ?? '',
      user.Oked ?? '',
      user.createdAt.toISOString(),
    ]);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=user_data.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }

  @UseGuards(AuthGuard)
  @Get('export/orders-excel')
  async exportOrdersExcel(@Req() req:Request, @Res() res: Response) {
    const userId = req['user-id'];
    const orders = await this.myDataService.getUserOrders(userId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    const workbook = new ExcelJS.Workbook();

    // Orders sheet
    const ordersSheet = workbook.addWorksheet('Orders');
    ordersSheet.addRow([
      'Order ID', 'Total', 'Address', 'Date', 'Payment Type', 'With Delivery', 'Status', 'Comment To Delivery', 'Created At'
    ]);
    orders.forEach(order => {
      ordersSheet.addRow([
        order.id,
        order.total ?? '',
        order.address,
        order.date.toISOString(),
        order.paymentType,
        order.withDelivery ? 'Yes' : 'No',
        order.status,
        order.commentToDelivery ?? '',
        order.createdAt.toISOString(),
      ]);
    });

    // Order Items sheet
    const orderItemsSheet = workbook.addWorksheet('Order Items');
    orderItemsSheet.addRow([
      'Order Item ID', 'Order ID', 'Product Name', 'Level', 'Quantity', 'Measure', 'Measure Count', 'Created At'
    ]);
    orders.forEach(order => {
      order.OrderItems.forEach(item => {
        orderItemsSheet.addRow([
          item.id,
          order.id,
          item.product?.name_uz || '',
          item.level?.name_uz || '',
          item.quantity,
          item.meansure,
          item.meansureCount ?? '',
          item.createdAt.toISOString(),
        ]);
      });
    });

    // Order Tools sheet
    const orderToolsSheet = workbook.addWorksheet('Order Tools');
    orderToolsSheet.addRow([
      'Order Tool ID', 'Order ID', 'Tool Name', 'Count', 'Total', 'Created At'
    ]);
    orders.forEach(order => {
      order.OrderTools.forEach(tool => {
        orderToolsSheet.addRow([
          tool.id,
          order.id,
          tool.tool?.name_uz || '',
          tool.count,
          tool.total ?? '',
          tool.createdAt.toISOString(),
        ]);
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=user_orders.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  }
}
