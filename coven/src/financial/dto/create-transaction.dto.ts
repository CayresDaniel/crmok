import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  amount: number;

  @IsDateString()
  date: string;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsBoolean()
  @IsOptional()
  recurrent?: boolean;
}
