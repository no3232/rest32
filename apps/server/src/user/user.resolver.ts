import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  User,
  PaginationInput,
  PaginatedUsers,
  UpdateUserInput,
} from './user.schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

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
    @Args('uuid', { type: () => String }) uuid: string,
  ): Promise<User | null> {
    return this.userService.getUserById(uuid);
  }

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  async me(@Context() context) {
    const user = context.req.user;
    return this.userService.getUserByUserId(user.userId);
  }

  @Mutation((returns) => User)
  async updateUser(
    @Args('uuid', { type: () => String }) uuid: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    return this.userService.updateUser(uuid, data);
  }

  @Mutation((returns) => User)
  async deleteUser(
    @Args('uuid', { type: () => String }) uuid: string,
  ): Promise<User> {
    return this.userService.deleteUser(uuid);
  }
}
