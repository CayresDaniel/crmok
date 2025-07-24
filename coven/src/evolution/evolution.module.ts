// src/evolution/evolution.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EvolutionController } from './evolution.controller';
import { EvolutionApiService } from './evolution.service';
import { ClientsService } from './clients.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [EvolutionController],
  providers: [EvolutionApiService, ClientsService],
  exports: [EvolutionApiService, ClientsService],
})
export class EvolutionModule {}