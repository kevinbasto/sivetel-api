import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('recharges')
  getProducts(){
    return this.productsService.getProducts();
  }

  @Get('services')
  getServices(){
    return this.productsService.getServices();
  }

  @Get('pins')
  getPins(){
    return this.productsService.getPins();
  }
}
