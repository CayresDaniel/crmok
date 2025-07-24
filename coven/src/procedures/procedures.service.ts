import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';

@Injectable()
export class ProceduresService {
  constructor(private prisma: PrismaService) {}

  async create(createProcedureDto: CreateProcedureDto) {
    return this.prisma.procedure.create({
      data: createProcedureDto,
    });
  }

  async findAll() {
    return this.prisma.procedure.findMany({
      where: { active: true },
      include: {
        procedureProducts: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id },
      include: {
        procedureProducts: {
          include: {
            product: true,
          },
        },
        appointmentProcedures: {
          include: {
            appointment: {
              include: {
                client: { select: { name: true } },
                user: { select: { name: true } },
              },
            },
          },
          orderBy: { appointment: { date: 'desc' } },
          take: 10,
        },
      },
    });

    if (!procedure) {
      throw new NotFoundException('Procedimento não encontrado');
    }

    return procedure;
  }

  async update(id: string, updateProcedureDto: UpdateProcedureDto) {
    await this.findOne(id);

    return this.prisma.procedure.update({
      where: { id },
      data: updateProcedureDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.procedure.update({
      where: { id },
      data: { active: false },
    });
  }

  async addProduct(procedureId: string, productId: string, quantity: number) {
    await this.findOne(procedureId);

    return this.prisma.procedureProduct.upsert({
      where: {
        procedureId_productId: {
          procedureId,
          productId,
        },
      },
      update: { quantity },
      create: {
        procedureId,
        productId,
        quantity,
      },
    });
  }

  async removeProduct(procedureId: string, productId: string) {
    return this.prisma.procedureProduct.delete({
      where: {
        procedureId_productId: {
          procedureId,
          productId,
        },
      },
    });
  }
}
