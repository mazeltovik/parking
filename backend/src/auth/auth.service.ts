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

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
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
        return { statusCode: 201, message: 'User valid' };
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
}
