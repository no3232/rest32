import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { Reservation, CreateReservationInput } from './reservation.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Query(() => [Reservation])
  @UseGuards(GqlAuthGuard)
  async Reservations(
    @Args('date', { type: () => Date }) date: Date,
    @Context() context: any,
  ): Promise<Reservation[]> {
    return await this.reservationService.getList(date);
  }

  @Query(() => Reservation)
  @UseGuards(GqlAuthGuard)
  async Reservation(
    @Args('uuid', { type: () => String }) uuid: string,
  ): Promise<Reservation> {
    return await this.reservationService.getReservation(uuid);
  }

  @Mutation(() => Reservation)
  @UseGuards(GqlAuthGuard)
  async createReservation(
    @Args('data') data: CreateReservationInput,
  ): Promise<Reservation> {
    return await this.reservationService.createReservation(data);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteReservation(
    @Args('reservationId', { type: () => String }) reservationId: string,
    @Context() context: any,
  ): Promise<boolean> {
    const userUuid = await context.req.user.uuid;
    console.log(userUuid);
    return await this.reservationService.deleteReservation(
      reservationId,
      userUuid,
    );
  }
}
