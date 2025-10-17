import { Controller, Get, Param, Query, Res } from '@nestjs/common';
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

  @Get('providers')
  getProviders(@Query('type') type: "RECHARGES" | "SERVICES" | "PINS") {
    return this.productsService.getProviders(type);
  }

  @Get('provider-image/:providerId')
  async getProviderImage(
    @Param('providerId') providerId: string,
    @Res() res: any
  ) {
    const imagePath = await this.productsService.getProviderImage(+providerId);
    return res.sendFile(imagePath);
  }
}
