import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { CreateReservationInput } from './reservation.schema';

@Injectable()
export class ReservationRepository {
  constructor(
    private readonly txPrisma: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async createReservation(data: CreateReservationInput) {
    try {
      return await this.txPrisma.tx.reservation.create({
        data: {
          reservationDate: data.reservationDate,
          ownerId: data.userUuid,
        },
        include: {
          owner: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async createReservationOnOwner(
    data: CreateReservationInput,
    reservationUuid: string,
  ) {
    return await this.txPrisma.tx.reservationOnUser.create({
      data: {
        userUuid: data.userUuid,
        reservationId: reservationUuid,
        request: data.request,
        isAccepted: true,
      },
      include: {
        user: true,
      },
    });
  }
}
