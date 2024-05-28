import { Field, InputType, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(type => Int)
  id: number;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class PaginationInput {
  @Field(type => Int)
  page: number;

  @Field(type => Int)
  pageSize: number;
}

@ObjectType()
export class PaginatedUsers {
  @Field(type => [User])
  users: User[];

  @Field(type => Int)
  totalCount: number;

  @Field(type => Int)
  totalPages: number;
}