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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockMovementDto } from './dto/stock-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('low-stock')
  getLowStockProducts() {
    return this.productsService.getLowStockProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/stock/add')
  addStock(
    @Param('id') id: string,
    @Body() stockMovementDto: StockMovementDto,
  ) {
    return this.productsService.addStock(id, stockMovementDto);
  }

  @Post(':id/stock/remove')
  removeStock(
    @Param('id') id: string,
    @Body() stockMovementDto: StockMovementDto,
  ) {
    return this.productsService.removeStock(id, stockMovementDto);
  }
}
