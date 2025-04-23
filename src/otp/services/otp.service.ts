import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Otp } from '../entities/otp.entity';
import { MoreThan, Repository } from 'typeorm';
import { OtpType } from '../enums/otp.enum';
import { envs } from 'src/common/config';
import { Logger } from '@nestjs/common';

export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  async createOtp(userId: string, type: OtpType): Promise<string> {
    const existingOtp = await this.delayBetweenOtps(userId, type);
    if (existingOtp) {
      const timeLeft = existingOtp.expiresAt.getTime() - new Date().getTime();
      const minutesLeft = Math.floor(timeLeft / 1000 / 60);
      if (minutesLeft > 0) {
        this.logger.warn(
          `OTP already sent. Please wait ${minutesLeft} minutes before requesting a new one.`,
        );
        throw new Error(
          `OTP already sent. Please wait ${minutesLeft} minutes before requesting a new one.`,
        );
      }
    }

    await this.invalidateOldOtps(userId);
    const otpToken = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otpToken, 10);

    const otp = this.otpRepository.create({
      user: { id: userId },
      token: hashedOtp,
      isUsed: false,
      type,
      expiresAt: new Date(Date.now() + envs.OTP_EXPIRATION_MINUTES * 60 * 1000),
    });

    await this.otpRepository.save(otp);

    return otpToken;
  }

  async verifyOtp(userId: string, otpToken: string): Promise<boolean> {
    try {
      const otp = await this.findValidOtp(userId);
      if (!otp) return false;

      const isValid = await this.validateOtp(otp, otpToken);

      if (!isValid) return false;

      await this.markOtpAsUsed(otp);
      return true;
    } catch (error) {
      this.logger.error(`Error verifying OTP for user: ${userId}`, error);
      throw new Error('Failed to verify OTP');
    }
  }

  private async findValidOtp(userId: string): Promise<Otp | null> {
    try {
      const otp = await this.otpRepository.findOne({
        where: {
          user: { id: userId },
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!otp) {
        this.logger.warn(`No valid OTP found for user: ${userId}`);
        return null;
      }

      if (otp.isUsed) {
        this.logger.warn(`OTP already used for user: ${userId}`);
        return null;
      }

      return otp;
    } catch (error) {
      this.logger.error(`Error finding OTP for user: ${userId}`, error);
      throw new Error('Failed to find OTP');
    }
  }

  private validateOtp(otp: Otp, otpToken: string): Promise<boolean> {
    return bcrypt.compare(otpToken, otp.token);
  }

  private async markOtpAsUsed(otp: Otp): Promise<void> {
    otp.isUsed = true;
    await this.otpRepository.save(otp);
  }

  private async invalidateOldOtps(userId: string): Promise<void> {
    const oldOtps = await this.otpRepository.find({
      where: {
        user: { id: userId },
        isUsed: false,
      },
    });

    for (const otp of oldOtps) {
      otp.isUsed = true;
      await this.otpRepository.save(otp);
    }
  }

  async delayBetweenOtps(userId: string, type: OtpType): Promise<Otp | null> {
    const lastOtp = await this.otpRepository.findOne({
      where: {
        user: { id: userId },
        type,
        expiresAt: MoreThan(new Date()),
        isUsed: false,
      },
      order: { createdAt: 'DESC' },
    });

    return lastOtp;
  }
}
