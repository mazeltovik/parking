import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation as ReservationModel } from '../../generated/prisma/client';

type ReservationBody = Omit<ReservationModel, 'id'>;

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @HttpCode(201)
  createReservation(@Body() body: ReservationBody) {
    return this.reservationsService.createReservation(body);
  }

  @HttpCode(200)
  @Get('/:id')
  getAvailableTimes(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.reservationsService.getReservationByUserId(id);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteReservation(
    @Param('id', new ParseUUIDPipe({ version: '4' })) reservationId: string,
  ) {
    return this.reservationsService.removeReservation(reservationId);
  }
}
