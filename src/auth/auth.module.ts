import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh-jwt.config';
import googleOauthConfig from './config/google-oauth.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { GoogleStrategy } from './strategies/google.strategy';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    TokenService,
    GoogleStrategy,
    //LocalStrategy,
    //RefreshJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
