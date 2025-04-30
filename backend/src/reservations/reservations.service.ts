import {
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Reservation as ReservationModel } from '../../generated/prisma/client';

type ReservationBody = Omit<ReservationModel, 'id'>;

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async createReservation(body: ReservationBody) {
    const id = uuidv4();
    const isCreated = await this.prisma.reservation.create({
      data: { id, ...body },
    });
    if (isCreated) {
      return { statusCode: 201, message: 'Reservation created' };
    } else {
      throw new BadRequestException('Something wrong');
    }
  }

  async getReservationByUserId(id: string) {
    const userReservations = await this.prisma.reservation.findMany({
      where: { userId: id },
      include: {
        parkingSpot: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });
    return userReservations;
  }
  async removeReservation(reservationId: string) {
    try {
      await this.prisma.reservation.delete({
        where: {
          id: reservationId,
        },
      });
    } catch (err) {
      throw new BadRequestException('Something wrong');
    }
  }
}
