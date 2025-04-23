import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from '../dto/register-auth.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto, RequestOtpDto } from '../dto';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import {
  AuthJwtPayload,
  GoogelAuthResponseType,
  AuthResponseType,
} from '../types';
import { TokenService } from './token.service';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserVerifiedStatus } from 'src/users/enums/user-verified-status.enum';
import { OtpService } from 'src/otp/services/Otp.service';
import { OtpType } from 'src/otp/enums/otp.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async register(createAuthDto: RegisterAuthDto): Promise<AuthResponseType> {
    try {
      const existingUser = await this.userService.findOne({
        where: { email: createAuthDto.email },
      });

      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const user = await this.userService.create({
      ...createAuthDto,
      password: hashedPassword,
    });

    if (!user) {
      throw new UnauthorizedException('User registration failed');
    }

    const payload = { sub: user.id, email: user.email };
    const { token, refreshToken } = await this.generateTokens(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.updateHashedRefreshToken(
      user.id,
      hashedRefreshToken,
    );

    return {
      success: true,
      message: 'User registered successfully',
      token,
      refreshToken,
      user,
    };
  }

  async login(loginAuthDto: LoginAuthDto): Promise<AuthResponseType> {
    const { email, password, otp } = loginAuthDto;
    const user = await this.userService.findOneFull({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.verified === UserVerifiedStatus.UNVERIFIED) {
      if (!otp) {
        throw new UnauthorizedException(
          'User account is not verified, please verify your email',
        );
      }
      await this.userService.verifyEmail(user.id, otp);
    }

    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const { token, refreshToken } = await this.generateTokens(payload);
    try {
      await this.userService.updateHashedRefreshToken(user.id, refreshToken);
    } catch (error) {
      this.logger.error('Failed to update hashed refresh token', error);
      throw new UnauthorizedException('Failed to update refresh token');
    }

    const responseUser = UserMapper.toResponseUserDto(user);
    return {
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: responseUser,
    };
  }

  async validateUser(payload: AuthJwtPayload): Promise<ResponseUserDto> {
    const user = await this.userService.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return plainToInstance(ResponseUserDto, user);
  }

  async refreshToken(userId: string): Promise<AuthResponseType> {
    const user = await this.userService.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
    };
    const { token, refreshToken } = await this.generateTokens(payload);
    await this.userService.updateHashedRefreshToken(user.id, refreshToken);
    return {
      success: true,
      message: 'Token refreshed successfully',
      token,
      refreshToken,
      user: user,
    };
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.userService.findOneFull({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Use TokenService to validate the refresh token
    const isRefreshTokenValid = await this.tokenService.validateRefreshToken(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return isRefreshTokenValid;
  }

  async logout(userId: string): Promise<void> {
    await this.userService.updateHashedRefreshToken(userId, null);
  }

  async generateTokens(
    payload: AuthJwtPayload,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.tokenService.generateTokens(payload, this.refreshTokenConfig);
  }

  async validateGoogleUser(
    googleUser: CreateUserDto,
  ): Promise<GoogelAuthResponseType> {
    const existingUser = await this.userService.findOneByEmail(
      googleUser.email,
    );

    if (existingUser) {
      return {
        success: true,
        message: 'User already exists',
        user: existingUser,
      };
    }

    const user = await this.userService.create(googleUser);

    if (user) {
      return {
        success: true,
        message: 'User registered successfully',
        user,
      };
    }

    this.logger.error('Failed to register user with Google');
  }

  async googleLogin({ email }: { email: string }): Promise<AuthResponseType> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const { token, refreshToken } = await this.generateTokens(payload);
    await this.userService.updateHashedRefreshToken(user.id, refreshToken);
    return {
      success: true,
      message: 'Google login successful',
      token,
      refreshToken,
      user,
    };
  }

  async requestOtp(requestOtpDto: RequestOtpDto): Promise<{
    message: string;
    success: boolean;
  }> {
    const { email } = requestOtpDto;
    const user = await this.userService.findOneFull({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verified === UserVerifiedStatus.VERIFIED) {
      throw new UnauthorizedException('User already verified');
    }

    const userEntity = UserMapper.toEntity(user);
    await this.userService.sendEmailVerification(userEntity, OtpType.RESET_OTP);

    return {
      message: 'OTP sent successfully',
      success: true,
    };
  }
}
