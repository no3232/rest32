import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.schema';

@ObjectType()
export class Reservation {
  @Field(() => ID)
  uuid: string;

  @Field()
  reservationDate: Date;

  @Field(() => User)
  owner: User;

  @Field(() => [User])
  users: User[];

  @Field(() => [ReservationOnUser])
  ReservationOnUser: ReservationOnUser[];
}

@ObjectType()
export class ReservationOnUser {
  @Field(() => ID)
  userUuid: string;

  @Field(() => ID)
  reservationId: string;

  @Field()
  user: User;

  @Field()
  isAccepted: boolean;

  @Field({ nullable: true })
  request: string;
}

@InputType()
export class CreateReservationInput {
  @Field()
  reservationDate: Date;

  @Field(() => ID)
  userUuid: string;

  @Field({ nullable: true })
  request?: string;

  @Field(() => [ID], { nullable: true })
  inviteUsersUuid: string[];
}

@InputType()
export class AddUserToReservationInput {
  @Field()
  userUuid: string;

  @Field()
  reservationId: string;

  @Field({ nullable: true })
  request?: string;
}
