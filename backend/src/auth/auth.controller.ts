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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('register')
  signUp(@Body() signUpUser: UserModel) {
    return this.authService.signUp(signUpUser);
  }
  @HttpCode(201)
  @Post('login')
  signIn(@Body() signIpUser: UserModel) {
    return this.authService.singIn(signIpUser);
  }
}
