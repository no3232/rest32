import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(
    page: number,
    pageSize: number,
  ): Promise<{ users: User[]; totalCount: number; totalPages: number }> {
    const skip = (page - 1) * pageSize;
    const [users, totalCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
      }),
      this.prisma.user.count(),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return { users, totalCount, totalPages };
  }

  async getUserById(uuid: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { uuid } });
  }

  async getUserByUserId(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Unique constraint failed on the ${error.meta.target}`,
          );
        }
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateUser(uuid: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { uuid },
      data,
    });
  }

  async deleteUser(uuid: string): Promise<User> {
    return this.prisma.user.delete({
      where: { uuid },
    });
  }
}
