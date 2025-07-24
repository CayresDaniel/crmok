import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FinancialService } from '../financial/financial.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockMovementDto } from './dto/stock-movement.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => FinancialService))
    private financialService: FinancialService,
  ) {
    console.log(
      '🔧 ProductsService initialized with FinancialService:',
      !!this.financialService,
    );
  }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }

  async addStock(id: string, stockMovementDto: StockMovementDto) {
    console.log(
      '📦 AddStock chamado para produto:',
      id,
      'quantidade:',
      stockMovementDto.quantity,
    );
    const product = await this.findOne(id);
    console.log(
      '📦 Produto encontrado:',
      product.name,
      'preço:',
      product.price,
    );

    const result = await this.prisma.$transaction(async (prisma) => {
      await prisma.stockMovement.create({
        data: {
          productId: id,
          type: 'RECEITA',
          quantity: stockMovementDto.quantity,
          reason: stockMovementDto.reason,
        },
      });

      return prisma.product.update({
        where: { id },
        data: {
          stock: product.stock + stockMovementDto.quantity,
        },
      });
    });

    // Criar transação financeira de despesa para compra de produto
    console.log('💰 Iniciando criação de transação financeira...');
    await this.createFinancialTransactionForStockAddition(
      product,
      stockMovementDto,
    );
    console.log('💰 Transação financeira processada.');

    return result;
  }

  async removeStock(id: string, stockMovementDto: StockMovementDto) {
    const product = await this.findOne(id);

    if (product.stock < stockMovementDto.quantity) {
      throw new BadRequestException('Estoque insuficiente');
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.stockMovement.create({
        data: {
          productId: id,
          type: 'DESPESA',
          quantity: stockMovementDto.quantity,
          reason: stockMovementDto.reason,
        },
      });

      return prisma.product.update({
        where: { id },
        data: {
          stock: product.stock - stockMovementDto.quantity,
        },
      });
    });
  }

  async getLowStockProducts() {
    return this.prisma.product.findMany({
      where: {
        active: true,
        stock: {
          lte: this.prisma.product.fields.minStock,
        },
      },
      orderBy: { stock: 'asc' },
    });
  }

  async consumeProductForProcedure(
    productId: string,
    quantity: number,
    reason: string,
  ) {
    const product = await this.findOne(productId);

    if (product.type !== 'USO_INTERNO') {
      throw new BadRequestException('Produto não é de uso interno');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Estoque insuficiente para ${product.name}`,
      );
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.stockMovement.create({
        data: {
          productId,
          type: 'DESPESA',
          quantity,
          reason,
        },
      });

      return prisma.product.update({
        where: { id: productId },
        data: {
          stock: product.stock - quantity,
        },
      });
    });
  }

  private async createFinancialTransactionForStockAddition(
    product: any,
    stockMovementDto: StockMovementDto,
  ) {
    try {
      console.log('🔍 Verificando FinancialService:', !!this.financialService);

      if (!this.financialService) {
        console.error('❌ FinancialService não está disponível!');
        return;
      }

      // Calcular o valor total baseado no preço do produto e quantidade
      let totalAmount = 0;
      let description = '';

      if (product.price && Number(product.price) > 0) {
        totalAmount = Number(product.price) * stockMovementDto.quantity;
        description = `Despesa - Compra de estoque - Produto: ${product.name} - Quantidade: ${stockMovementDto.quantity}${product.unit ? ` ${product.unit}` : ''} - ${stockMovementDto.reason || 'Reposição de estoque'} - Valor unitário: R$ ${Number(product.price).toFixed(2)}`;
        console.log(
          `💰 Criando despesa automática: ${product.name} - R$ ${totalAmount.toFixed(2)}`,
        );
      } else {
        // Mesmo sem preço, criar registro para controle
        description = `Despesa - Compra de estoque - Produto: ${product.name} - Quantidade: ${stockMovementDto.quantity}${product.unit ? ` ${product.unit}` : ''} - ${stockMovementDto.reason || 'Reposição de estoque'} - ATENÇÃO: Produto sem preço definido, valor a definir`;
        console.log(
          `⚠️ Criando despesa com valor 0 - Produto ${product.name} sem preço definido`,
        );
      }

      console.log('💾 Chamando financialService.create com:', {
        type: 'DESPESA',
        category: 'Produtos/Estoque',
        amount: totalAmount,
        isPaid: totalAmount > 0,
      });

      const transaction = await this.financialService.create({
        type: 'DESPESA',
        category: 'Produtos/Estoque',
        description,
        amount: totalAmount,
        date: new Date().toISOString(),
        isPaid: totalAmount > 0, // Só marca como pago se tem valor
        recurrent: false,
      });

      console.log(
        `✅ Transação financeira criada com sucesso: ID ${transaction.id}`,
      );
      return transaction;
    } catch (error) {
      console.error(
        '❌ Erro ao criar transação financeira para adição de estoque:',
        error,
      );
      console.error('Detalhes do erro:', error.message);
      console.error('Stack trace:', error.stack);
      // Não queremos que falhe a adição de estoque por causa de erro financeiro
    }
  }
}
