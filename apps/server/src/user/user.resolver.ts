import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  User,
  CreateUserInput,
  PaginationInput,
  PaginatedUsers,
} from './user.schema';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => PaginatedUsers)
  async users(
    @Args('pagination') pagination: PaginationInput,
  ): Promise<PaginatedUsers> {
    const { page, pageSize } = pagination;
    const { users, totalCount, totalPages } = await this.userService.getUsers(
      page,
      pageSize,
    );
    return { users, totalCount, totalPages };
  }
  @Query((returns) => User, { nullable: true })
  async user(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Mutation((returns) => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Mutation((returns) => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: CreateUserInput,
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Mutation((returns) => User)
  async deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
