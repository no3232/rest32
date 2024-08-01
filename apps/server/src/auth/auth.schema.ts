import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Reservation } from 'src/reservation/reservation.schema';

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  userId: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field({ nullable: true })
  profilePicture: string | null;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
