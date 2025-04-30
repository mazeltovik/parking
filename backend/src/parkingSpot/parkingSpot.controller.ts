import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ParkingSpotService } from './parkingSpot.service';

@Controller('parking-spots')
export class ParkingSpotController {
  constructor(private readonly parkingSpotService: ParkingSpotService) {}

  @HttpCode(200)
  @Get()
  getParkingSpot() {
    return this.parkingSpotService.getParkingSpot();
  }

  @HttpCode(200)
  @Get('availableTimes/:id')
  getAvailableTimes(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.parkingSpotService.getAvailableTimes(id);
  }
}
