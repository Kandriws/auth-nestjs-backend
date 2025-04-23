import { IsEmail, IsString } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @IsEmail()
  email: string;
}
