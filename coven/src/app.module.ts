import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ProceduresModule } from './procedures/procedures.module';
import { ProductsModule } from './products/products.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { FinancialModule } from './financial/financial.module';
import { RemindersModule } from './reminders/reminders.module';
import { EvolutionModule } from './evolution/evolution.module';

@Module({
  imports: [
   
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EvolutionModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ProceduresModule,
    ProductsModule,
    AppointmentsModule,
    FinancialModule,
    RemindersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
