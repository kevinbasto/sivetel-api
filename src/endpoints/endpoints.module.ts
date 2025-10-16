import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { BalancesModule } from './balances/balances.module';


@Module({
  imports: [UsersModule, AuthModule, ProductsModule, BalancesModule]
})
export class EndpointsModule {}
