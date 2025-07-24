import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddProductToProcedureDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  quantity: number;
}
