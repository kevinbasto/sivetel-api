import { Controller, Get, UseGuards } from '@nestjs/common';
import { BalancesService } from './balances.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AdminGuard } from 'src/guards/admin/admin.guard';

@UseGuards(AuthGuard, AdminGuard)
@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get('')
  getBalance() {
    return this.balancesService.getBalance();
  }
}
