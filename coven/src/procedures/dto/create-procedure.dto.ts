import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProcedureDto {
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

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  duration: number;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  price: number;
}
