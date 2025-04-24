import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Param,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { LoginAuthDto } from '../dto/login-auth.dto';
import { Public } from '../decorators/public.decorator';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { RequestOtpDto } from '../dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return {
      message: 'Refresh token',
      refreshToken,
    };
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('callback')
  googleCallback(@Req() req: any) {
    return this.authService.googleLogin(req.user);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPasswordDto);
  }

  @Public()
  @Post('request-otp')
  requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto);
  }
}
