import { Module } from '@nestjs/common';
import { ParkingSpotService } from './parkingSpot.service';
import { ParkingSpotController } from './parkingSpot.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ParkingSpotController],
  providers: [ParkingSpotService, PrismaService],
})
export class ParkingSpotModule {}
