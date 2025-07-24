import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('financial')
@UseGuards(JwtAuthGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.financialService.create(createTransactionDto);
  }

  @Get()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: string,
  ) {
    return this.financialService.findAll(startDate, endDate, type);
  }

  @Get('dashboard')
  getDashboard(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.financialService.getDashboard(startDate, endDate);
  }

  @Get('overdue')
  getOverdueTransactions() {
    return this.financialService.getOverdueTransactions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.financialService.update(id, updateTransactionDto);
  }

  @Patch(':id/pay')
  markAsPaid(@Param('id') id: string) {
    return this.financialService.markAsPaid(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialService.remove(id);
  }
}
