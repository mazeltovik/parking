import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { User as UserModel } from '../../generated/prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signUp(signUpUser: UserModel) {
    const { email, password } = signUpUser;
    const isEmailExist = await this.prisma.user.findFirst({ where: { email } });
    if (isEmailExist) {
      throw new ConflictException('Conflict. Email already exists');
    } else {
      const saltRounds = 10;
      const salt = this.configService.get<string>('PASSWORD_SALT');
      const hash = await bcrypt.hash(password + salt, saltRounds);
      const user = { id: uuidv4(), email, password: hash };
      await this.prisma.user.create({ data: user });
      return { statusCode: 201, message: 'User created' };
    }
  }
  async singIn(singInUser: UserModel) {
    const { email, password } = singInUser;
    const isEmailExist = await this.prisma.user.findFirst({ where: { email } });
    if (!isEmailExist) {
      throw new ForbiddenException("This email doesn't exist");
    } else {
      const { password: hashedPassword } = isEmailExist;
      const isValid = await this.comparePassword(password, hashedPassword);
      if (isValid) {
        const tokens = await this.getTokens(
          isEmailExist.id,
          isEmailExist.email,
        );
        return { id: isEmailExist.id, ...tokens };
      } else {
        throw new ForbiddenException(
          "This password doesn't valid. Please try again",
        );
      }
    }
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const salt = this.configService.get<string>('PASSWORD_SALT');
    return bcrypt.compare(password + salt, hashedPassword);
  }

  async getTokens(userId: string, username: string) {
    const secret = this.configService.get<string>('JWT_SECRET_KEY') as string;
    const expireTokenTime = this.configService.get<string>(
      'TOKEN_EXPIRE_TIME',
    ) as string;
    const refreshSecret = this.configService.get<string>(
      'JWT_SECRET_REFRESH_KEY',
    ) as string;
    const expireRefreshTokenTime = this.configService.get<string>(
      'TOKEN_REFRESH_EXPIRE_TIME',
    ) as string;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret,
          expiresIn: expireTokenTime,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: refreshSecret,
          expiresIn: expireRefreshTokenTime,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async refreshTokens(id: string, refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing or invalid');
    }
    const isEmailExist = await this.prisma.user.findFirst({ where: { id } });
    if (isEmailExist) {
      const refreshSecret = this.configService.get<string>(
        'JWT_SECRET_REFRESH_KEY',
      ) as string;
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
      if (!payload) {
        throw new UnauthorizedException('Refresh token is missing or invalid');
      }
      const tokens = await this.getTokens(isEmailExist.id, isEmailExist.email);
      return { id: isEmailExist.id, ...tokens };
    }
  }
}
