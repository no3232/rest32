import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservationInput, Reservation } from './reservation.schema';
import { ReservationRepository } from './reservation.repository';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class ReservationService {
  constructor(
    private prisma: PrismaService,
    private reservationRepository: ReservationRepository,
  ) {}

  // 유저리스트를 추가하는 함수
  private mapReservationUserList(
    reservation: Omit<Reservation, 'users'>,
  ): Reservation {
    const userList = reservation.ReservationOnUser;
    return {
      ...reservation,
      users: userList.map((ru) => ru.user),
    };
  }

  // 예약 리스트 조회
  async getList(date: Date): Promise<Reservation[]> {
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const reservations = await this.prisma.reservation.findMany({
      where: {
        reservationDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        owner: true,
        ReservationOnUser: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        reservationDate: 'asc',
      },
    });

    const newList = reservations.map((reservation) => {
      return this.mapReservationUserList(reservation);
    });

    return newList;
  }

  // 예약 조회
  async getReservation(uuid: string): Promise<Reservation> {
    const reservation = await this.prisma.reservation.findUnique({
      where: {
        uuid,
      },
      include: {
        owner: true,
        ReservationOnUser: {
          include: {
            user: true,
          },
        },
      },
    });

    return this.mapReservationUserList(reservation);
  }

  // 예약 생성
  @Transactional()
  async createReservation(data: CreateReservationInput): Promise<Reservation> {
    const reservation =
      await this.reservationRepository.createReservation(data);

    const ReservationOnOwner =
      await this.reservationRepository.createReservationOnOwner(
        data,
        reservation.uuid,
      );

    const inviteePromises = data.inviteUsersUuid.map((inviteeUuid) =>
      this.reservationRepository.createReservationOnOwner(
        {
          userUuid: inviteeUuid,
          inviteUsersUuid: data.inviteUsersUuid,
          reservationDate: data.reservationDate,
        },
        reservation.uuid,
      ),
    );

    const ReservationOnInvitees = await Promise.all(inviteePromises);

    const users = [
      ReservationOnOwner.user,
      ...ReservationOnInvitees.map((invitee) => invitee.user),
    ];

    return {
      ...reservation,
      users,
      ReservationOnUser: [ReservationOnOwner, ...ReservationOnInvitees],
    };
  }

  async declineReservation(
    reservationId: string,
    userUuid: string,
  ): Promise<boolean> {
    await this.prisma.reservationOnUser.delete({
      where: {
        userUuid_reservationId: {
          userUuid,
          reservationId,
        },
      },
    });

    return true;
  }

  // 예약 삭제
  async deleteReservation(
    reservationId: string,
    userUuid: string,
  ): Promise<boolean> {
    const reservation = await this.prisma.reservation.findUnique({
      where: {
        uuid: reservationId,
      },
    });

    if (reservation.ownerId !== userUuid) {
      throw new UnauthorizedException('Unauthorized access');
    } else {
      await this.prisma.reservation.delete({
        where: {
          uuid: reservation.uuid,
        },
      });
    }

    return true;
  }
}
