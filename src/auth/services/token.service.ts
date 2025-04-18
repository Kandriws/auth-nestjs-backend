import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthJwtPayload } from '../types/auth-jwt-payload.type';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(
    payload: AuthJwtPayload,
    refreshTokenConfig: ConfigType<any>,
  ): Promise<{ token: string; refreshToken: string }> {
    const token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshTokenConfig,
    );
    return { token, refreshToken };
  }

  async validateRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    return await bcrypt.compare(refreshToken, hashedRefreshToken);
  }
}
