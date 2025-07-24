import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StockMovementDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  quantity: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
