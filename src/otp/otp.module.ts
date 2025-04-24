import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { OtpService } from './services/Otp.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import resetPasswordJwtConfig from 'src/auth/config/reset-password-jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    ConfigModule.forFeature(resetPasswordJwtConfig),
    JwtModule,
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
