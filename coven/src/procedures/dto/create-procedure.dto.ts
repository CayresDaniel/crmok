import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProcedureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  duration: number;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  price: number;
}
