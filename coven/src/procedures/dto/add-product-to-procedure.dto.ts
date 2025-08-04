import { IsString, IsNotEmpty } from 'class-validator';

export class AddProductToProcedureDto {
  @IsString()
  @IsNotEmpty()
  productId: string;
}
