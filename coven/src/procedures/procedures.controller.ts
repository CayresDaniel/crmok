import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProceduresService } from './procedures.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { AddProductToProcedureDto } from './dto/add-product-to-procedure.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('procedures')
@UseGuards(JwtAuthGuard)
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Post()
  create(@Body() createProcedureDto: CreateProcedureDto) {
    return this.proceduresService.create(createProcedureDto);
  }

  @Get()
  findAll() {
    return this.proceduresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proceduresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProcedureDto: UpdateProcedureDto,
  ) {
    return this.proceduresService.update(id, updateProcedureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proceduresService.remove(id);
  }

  @Post(':id/products')
  addProduct(
    @Param('id') id: string,
    @Body() addProductDto: AddProductToProcedureDto,
  ) {
    return this.proceduresService.addProduct(
      id,
      addProductDto.productId,
    );
  }

  @Delete(':id/products/:productId')
  removeProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.proceduresService.removeProduct(id, productId);
  }
}
