import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { OtpService } from 'src/otp/services/Otp.service';
import { OtpType } from 'src/otp/enums/otp.enum';
import { UserVerifiedStatus } from './enums/user-verified-status.enum';
import { EmailService } from 'src/email/email.service';
import {
  forgotPasswordEmail,
  generateWelcomeUserEmail,
  requestNewOtpEmail,
} from 'src/utils/welcome-user';
import * as bcrypt from 'bcrypt';
import { envs } from 'src/common/config';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new NotFoundException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    const userDto = UserMapper.toResponseUserDto(newUser);
    await this.sendEmailVerification(newUser, OtpType.EMAIL_VERIFICATION);
    return userDto;
  }

  async findOne(where: FindOneOptions<User>): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `User not found with criteria: ${JSON.stringify(where)}`,
      );
    }
    return UserMapper.toResponseUserDto(user);
  }

  async findOneFull(where: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(where);
    if (!user) {
      throw new NotFoundException(
        `User not found with criteria: ${JSON.stringify(where)}`,
      );
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<ResponseUserDto | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return UserMapper.toResponseUserDto(user);
  }

  async update(id: string, updates: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.preload({ id, ...updates });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.save(user);
    return UserMapper.toResponseUserDto(user);
  }

  async updateHashedRefreshToken(
    id: string,
    hashedRefreshToken: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.hashedRefreshToken = hashedRefreshToken;
    return await this.userRepository.save(user);
  }

  async verifyEmail(userId: string, otpToken: string): Promise<void> {
    const isVerified = await this.otpService.verifyOtp(userId, otpToken);

    if (!isVerified) {
      throw new BadRequestException(`Invalid OTP for user with id ${userId}`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    user.verified = UserVerifiedStatus.VERIFIED;
    await this.userRepository.save(user);
  }

  async sendEmailVerification(user: User, otpType: OtpType): Promise<void> {
    try {
      const otpToken = await this.otpService.createOtp(user, otpType);

      if (otpType === OtpType.RESET_OTP) {
        const emailBody = requestNewOtpEmail(user.name, otpToken);
        this.emailService.sendEmail({
          recipients: [user.email],
          subject: 'Email Verification',
          html: emailBody,
        });
      }

      if (otpType === OtpType.EMAIL_VERIFICATION) {
        const emailBody = generateWelcomeUserEmail(user.name, otpToken);
        this.emailService.sendEmail({
          recipients: [user.email],
          subject: 'Welcome to Our Service',
          html: emailBody,
        });
      }

      if (otpType === OtpType.RESET_PASSWORD) {
        const resetLink = `${envs.RESET_PASSWORD_URL}/${otpToken}`;
        const emailBody = forgotPasswordEmail(user.name, resetLink);
        this.emailService.sendEmail({
          recipients: [user.email],
          subject: 'Password Reset',
          html: emailBody,
        });
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        `Failed to send email verification to ${user.email}: ${error.message}`,
      );
    }
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{
    user: ResponseUserDto;
    message: string;
    success: boolean;
  }> {
    try {
      const { password } = resetPasswordDto;
      const { userId, email } = await this.otpService.verifyToken(token);
      const isValid = await this.otpService.verifyOtp(userId, token);

      if (!isValid) {
        throw new BadRequestException(
          `Invalid Token for user with id ${userId}`,
        );
      }
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      if (user.email !== email) {
        throw new BadRequestException(
          `Email ${email} does not match the user with id ${userId}`,
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.verified = UserVerifiedStatus.VERIFIED;
      await this.userRepository.save(user);
      const userDto = UserMapper.toResponseUserDto(user);

      return {
        user: userDto,
        message: 'Password reset successfully',
        success: true,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException(
          `Failed to reset password for user with token ${token}: ${error.message}`,
        );
      }
    }
  }
}
