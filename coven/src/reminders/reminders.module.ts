import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { ClientsModule } from '../clients/clients.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ClientsModule, ProductsModule],
  controllers: [RemindersController],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}
