import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsArray()
  @IsString({ each: true })
  procedureIds: string[];

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  observations?: string;
}
