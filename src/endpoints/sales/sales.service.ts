import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RechargeSaleDTO } from './dto/rechage-sale.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceSaleDTO } from './dto/service-sale.dto';
import { ConsultaSIVETEL } from '../balances/dto/consulta-sivetel';
import { Product } from 'src/entities/product.entity';
import { Service } from 'src/entities/service.entity';
import { Pin } from 'src/entities/pin.entity';
import { Sale } from 'src/entities/sale.entity';

@Injectable()
export class SalesService {
  
  account : string;
  username : string;
  password : string;

  endpoint;
  reservationEndpoint = "reservarTransaccion";
  processEndpoint = "procesarTransaccion"

  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(Pin) private pinRepo: Repository<Pin>,
    @InjectRepository(Sale) private saleRepo: Repository<Sale>,
  ) {
    this.account = this.configService.get<string>('SIVETEL_NUMBER')!;
    this.username = this.configService.get<string>('SIVETEL_USUARIO')!;
    this.password = this.configService.get<string>('SIVETEL_PASSWORD')!;
    this.endpoint = this.configService.get<string>('PROVIDER_APIURL');
    this.reservationEndpoint = `${this.endpoint}/${this.reservationEndpoint}`;
    this.processEndpoint = `${this.endpoint}/${this.processEndpoint}`;
  }

  async makeRechargePayment({ userId, productId, phoneNumber }: RechargeSaleDTO) {
    try {
      let user = (await this.userRepo.find({where: {id: userId}}))[0];
      if(!user)
        throw new UnauthorizedException("El usuario no fue encontrado");
      let product = (await this.productRepo.find({where: {id: productId}}))[0];
      if(!product)
        throw new UnauthorizedException("El producto no fue encontrado")
      let headers = this.buildHeaders();
      let body = this.buildBasicBody();
      body.append('numero', phoneNumber),
      body.append('producto', product.code);
      let response = await fetch(this.reservationEndpoint, {
        method: 'POST',
        headers,
        body: body.toString()
      });
      if(!response.ok)
        throw new InternalServerErrorException("Hubo un error al procesar la recarga");
      let resbody = await response.json();
      const { requestid } = resbody.data;
      let sale = await this.saleRepo.save({ transactionId: requestid, user, product, date: new Date(), type: 'recharge', status: 'pending' });
      body = this.buildBasicBody();
      body.append('requestid', requestid);
      response = await fetch(this.processEndpoint, {
        method: 'POST',
        headers,
        body: body.toString()
      });
      resbody = await response.json()

      if(resbody.status){
        await this.saleRepo.update({id: sale.id}, {status: 'accepted'})
        return { message: "recarga realizada" };
      }
      else{
        await this.saleRepo.update({id: sale.id}, {status: 'rejected'})
        return { message: "recarga fallida" };
      }
        
    } catch (error) {
      throw error;
    }
  }

  makeServicePayment(serviceSale: ServiceSaleDTO) {
    try {
      
    } catch (error) {
      throw error;
    }
  }

  async makePinPayment(rechargeSale: RechargeSaleDTO) {
    try {
      
    } catch (error) {
      throw error;
    }
  }

  private buildBasicBody() {
    let params = new URLSearchParams();
    params.append("cuenta", this.account);
    params.append("usuario", this.username);
    params.append("password", this.password);
    return params;
  }

  private buildHeaders() {
    let headers = new Headers();
    headers.append('Content-type', 'application/x-www-form-urlencoded');
    return headers;
  }
  
}