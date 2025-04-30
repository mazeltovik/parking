import {
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ParkingSpot as ParkingSpotModel } from '../../generated/prisma/client';

@Injectable()
export class ParkingSpotService {
  constructor(private prisma: PrismaService) {}
  async getParkingSpot() {
    const spots = await this.prisma.parkingSpot.findMany();
    return spots;
  }
  async getAvailableTimes(id: string) {
    try {
      const spot = await this.prisma.parkingSpot.findUnique({
        where: { id },
      });
      if (spot) {
        const reservations = await this.prisma.reservation.findMany({
          where: { parkingSpotId: spot.id },
          omit: { userId: true, status: true },
        });
        return { name: spot.name, location: spot.location, reservations };
      }
    } catch (err) {
      throw new BadRequestException('Something wrong');
    }
  }
}
