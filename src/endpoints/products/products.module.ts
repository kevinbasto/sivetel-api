import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Service } from 'src/entities/service.entity';
import { Pin } from 'src/entities/pin.entity';
import { Provider } from 'src/entities/provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Service, Pin, Provider])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
