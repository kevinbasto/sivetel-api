// dto/create-sale.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export enum SaleType {
  PRODUCT = 'product',
  SERVICE = 'service',
  PIN = 'pin'
}

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export class CreateSaleDto {
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  @Type(() => Number)
  @ValidateIf((o) => !o.serviceId && !o.pinId)
  productId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del servicio debe ser un número' })
  @Type(() => Number)
  @ValidateIf((o) => !o.productId && !o.pinId)
  serviceId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del pin debe ser un número' })
  @Type(() => Number)
  @ValidateIf((o) => !o.productId && !o.serviceId)
  pinId?: number;

  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  @Type(() => Number)
  amount: number;

  @IsNotEmpty({ message: 'El tipo de venta es requerido' })
  @IsEnum(SaleType, { message: 'El tipo debe ser: product, service o pin' })
  type: SaleType;

  @IsOptional()
  @IsEnum(SaleStatus, { message: 'El estado debe ser: pending, completed, cancelled o refunded' })
  status?: SaleStatus;
}