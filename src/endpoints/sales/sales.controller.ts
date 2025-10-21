import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { RechargeSaleDTO } from './dto/rechage-sale.dto';
import { ServiceSaleDTO } from './dto/service-sale.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('sales')
export class SalesController {
  constructor(
    private salesService: SalesService
  ) {}

  @Post('recharge')
  createRechargeSale (@Body() body: RechargeSaleDTO ) {
    return this.salesService.makeRechargePayment(body);
  }

  @Post('service')
  createServiceSale (@Body() body: ServiceSaleDTO ) {
    return this.salesService.makeServicePayment(body);
  }

  @Post('pin')
  createPinSale (@Body() body: RechargeSaleDTO ) {
    return this.salesService.makePinPayment(body);
  }


}
