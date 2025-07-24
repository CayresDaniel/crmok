import { PartialType } from '@nestjs/mapped-types';
import { CreateProcedureDto } from './create-procedure.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProcedureDto extends PartialType(CreateProcedureDto) {
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
