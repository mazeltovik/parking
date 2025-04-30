import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User as UserModel } from '../../generated/prisma/client';
import { Public } from 'src/decorators/publicPath';
import { RefreshTokenGuard } from './refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(201)
  @Post('register')
  signUp(@Body() signUpUser: UserModel) {
    return this.authService.signUp(signUpUser);
  }

  @Public()
  @HttpCode(201)
  @Post('login')
  signIn(@Body() signIpUser: UserModel) {
    return this.authService.singIn(signIpUser);
  }

  @UseGuards(RefreshTokenGuard)
  @Public()
  @Get('refresh/:id')
  refreshTokens(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Headers() headers,
  ) {
    const [type, refreshToken] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer'
      ? this.authService.refreshTokens(id, refreshToken)
      : this.authService.refreshTokens(id, undefined);
  }
}
