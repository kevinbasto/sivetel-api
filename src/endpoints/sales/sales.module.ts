import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from 'src/entities/sale.entity';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';
import { Service } from 'src/entities/service.entity';
import { Pin } from 'src/entities/pin.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Sale, User, Product, Service, Pin]),
    AuthModule
  ], 
  controllers: [SalesController],
  providers: [SalesService, EmailService],
})
export class SalesModule {}
