import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateIf((o) => o.category !== '')
  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  stock: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minStock: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  unitQuantity?: number;

  @IsString()
  @IsOptional()
  unitMeasurement?: string;

  @IsBoolean()
  @IsOptional()
  addToCost?: boolean;
}
