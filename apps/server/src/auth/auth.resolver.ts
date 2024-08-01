import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload, CreateUserInput } from './auth.schema';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<AuthPayload> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.genereateToken(user);
  }

  @Mutation(() => AuthPayload)
  async register(@Args('user') user: CreateUserInput): Promise<AuthPayload> {
    return this.authService.register(user);
  }
}
