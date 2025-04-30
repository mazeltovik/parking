import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err, user) {
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Refresh token is missing or invalid')
      );
    }
    return user;
  }
}
