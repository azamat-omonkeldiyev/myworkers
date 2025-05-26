import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionModule } from './region/region.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { SessionModule } from './session/session.module';
import { AdminModule } from './admin/admin.module';
import { ToolModule } from './tool/tool.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BrandModule } from './brand/brand.module';
import { CapacityModule } from './capacity/capacity.module';
import { SizeModule } from './size/size.module';
import { join } from 'path';
import { MulterController } from './multer/multer.controller';
import { ProductModule } from './product/product.module';
import { LevelModule } from './level/level.module';
import { MasterModule } from './master/master.module';
import { OrderModule } from './order/order.module';
import { BasketModule } from './basket/basket.module';
import { CommentModule } from './comment/comment.module';
import { GeneralInfoModule } from './general-info/general-info.module';
import { ContactModule } from './contact/contact.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { PartnersModule } from './partners/partners.module';
import { FaqModule } from './faq/faq.module';
import {  TelegramModule } from './bot/bot.module';
import { MyDataModule } from './mydata/mydata.module';
import { AdminExportModule } from './admin-export/admin-export.module';

@Module({
  imports: [
    RegionModule,
    PrismaModule,
    UserModule,
    MailModule,
    SessionModule,
    AdminModule,
    ToolModule,
    BrandModule,
    CapacityModule,
    SizeModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    ProductModule,
    LevelModule,
    MasterModule,
    OrderModule,
    BasketModule,
    CommentModule,
    GeneralInfoModule,
    ContactModule,
    ShowcaseModule,
    PartnersModule,
    FaqModule,
    TelegramModule,
    MyDataModule,
    AdminExportModule,
    ],
  controllers: [AppController, MulterController],
  providers: [AppService],
})
export class AppModule {}
