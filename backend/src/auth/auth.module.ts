import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenGuard } from './accessToken.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
