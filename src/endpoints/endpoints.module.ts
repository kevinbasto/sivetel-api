import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { BalancesModule } from './balances/balances.module';
import { SalesModule } from './sales/sales.module';


@Module({
  imports: [UsersModule, AuthModule, ProductsModule, BalancesModule, SalesModule, ]
})
export class EndpointsModule {}
