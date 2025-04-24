import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
