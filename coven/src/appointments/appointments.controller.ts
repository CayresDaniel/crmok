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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentStatus } from '@prisma/client';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
  ) {
    return this.appointmentsService.findAll(startDate, endDate, userId);
  }

  @Get('availability')
  checkAvailability(
    @Query('userId') userId: string,
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('duration') duration: string,
  ) {
    return this.appointmentsService.checkAvailability(
      userId,
      date,
      startTime,
      parseInt(duration),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
  ) {
    return this.appointmentsService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }

  // ===== ROTAS DE COMANDA =====

  @Patch(':id/confirm')
  confirmAppointment(@Param('id') id: string) {
    return this.appointmentsService.confirmAppointment(id);
  }

  @Patch(':id/open-comanda')
  openComanda(@Param('id') id: string) {
    return this.appointmentsService.openComanda(id);
  }

  @Post(':id/products')
  addProductToComanda(
    @Param('id') appointmentId: string,
    @Body() body: { productId: string; quantity: number }
  ) {
    return this.appointmentsService.addProductToComanda(
      appointmentId,
      body.productId,
      body.quantity
    );
  }

  @Post(':id/procedures')
  addProcedureToComanda(
    @Param('id') appointmentId: string,
    @Body() body: { procedureId: string; price?: number }
  ) {
    return this.appointmentsService.addProcedureToComanda(
      appointmentId,
      body.procedureId,
      body.price
    );
  }

  @Post(':id/finish')
  finishComanda(
    @Param('id') appointmentId: string,
    @Body() finishData: {
      paymentMethod: string;
      discount?: number;
      finalPrice?: number;
    }
  ) {
    return this.appointmentsService.finishComanda(appointmentId, finishData);
  }
}
