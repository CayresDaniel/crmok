import { Module, forwardRef } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { ProductsModule } from '../products/products.module';
import { FinancialModule } from '../financial/financial.module';

@Module({
  imports: [ProductsModule, FinancialModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
