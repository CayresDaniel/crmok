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
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(createReminderDto);
  }

  @Get()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: 'active' | 'inactive' | 'all',
    @Query('type') type?: string,
    @Query('clientId') clientId?: string,
  ) {
    return this.remindersService.findAll({
      startDate,
      endDate,
      status: status || 'active',
      type,
      clientId,
    });
  }

  @Get('active')
  getActiveReminders() {
    return this.remindersService.getActiveReminders();
  }

  @Post('birthdays/create')
  createBirthdayReminders() {
    return this.remindersService.createBirthdayReminders();
  }

  @Post('birthdays/check-daily')
  checkDailyBirthdays() {
    return this.remindersService.checkDailyBirthdays();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remindersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
  ) {
    return this.remindersService.update(id, updateReminderDto);
  }

  @Patch(':id/complete')
  markAsComplete(@Param('id') id: string) {
    return this.remindersService.markAsComplete(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remindersService.remove(id);
  }
}
