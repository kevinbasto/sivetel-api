import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@UseGuards(AuthGuard)
@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get('')
  getBalance() {
    return this.balancesService.getBalance();
  }

  @Get(":id")
  getSalesByUserId( @Param('id') id: string ) {
    return this.balancesService.getSalesByUser(+id);
  }

  @Get(":id/count")
  getSalesCountByUserId( @Param('id') id: string ) {
    return this.balancesService.getSalesCountByUser(+id);
  }
}
