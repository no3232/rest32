import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthPayload, CreateUserInput } from './auth.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 비밀번호 해싱
  async bycriptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const secretKey = this.configService.get<string>('PASSWORD_SECRET');
    const combinedPassword = password + secretKey;
    return await bcrypt.hash(combinedPassword, salt);
  }

  // 비밀번호 검증
  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const secretKey = this.configService.get<string>('PASSWORD_SECRET');
    const combinedPassword = password + secretKey; // 비밀 문자열을 비밀번호에 추가
    return bcrypt.compare(combinedPassword, hashedPassword);
  }

  // 사용자 검증
  async validateUser(userId: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (user && (await this.verifyPassword(password, user.password))) {
      return user;
    }
    return null;
  }

  // 토큰 생성
  async genereateToken(user: any): Promise<AuthPayload> {
    const payload = { uuid: user.uuid };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // 사용자 회원가입
  async register(user: CreateUserInput): Promise<AuthPayload> {
    const hashedPassword = await this.bycriptPassword(user.password);
    const regiterdUser = await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
    });

    return await this.genereateToken(regiterdUser);
  }
}
