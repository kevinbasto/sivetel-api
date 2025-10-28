import { Module } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { BalancesController } from './balances.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from 'src/entities/sale.entity';

@Module({
  imports: [
    ConfigModule, 
    AuthModule,
    TypeOrmModule.forFeature([Sale])
  ],
  controllers: [BalancesController],
  providers: [BalancesService],
})
export class BalancesModule {}
