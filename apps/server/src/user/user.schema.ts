import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field((type) => String)
  uuid: string;

  @Field()
  userId: string;

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

@InputType()
export class UpdateUserInput {
  @Field()
  userId: string;

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

@InputType()
export class PaginationInput {
  @Field((type) => Int)
  page: number;

  @Field((type) => Int)
  pageSize: number;
}

@ObjectType()
export class PaginatedUsers {
  @Field((type) => [User])
  users: User[];

  @Field((type) => Int)
  totalCount: number;

  @Field((type) => Int)
  totalPages: number;
}
