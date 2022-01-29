import {
  Controller,
  Request,
  Post,
  Get,
  UseGuards,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AuthService } from './modules/auth/auth.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly appService: AppService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log(`auth/login ${JSON.stringify(req.user)}`);
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(
    @Request() req,
    @Body('username') username,
    @Body('email') email,
    @Body('password') password,
  ) {
    console.log(`auth/register ${JSON.stringify(req.body)}`);
    //TODO add request validation
    return this.authService.createUser(username, email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
