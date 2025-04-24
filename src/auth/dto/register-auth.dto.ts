import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterAuthDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsDefined()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  readonly password: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;
}
