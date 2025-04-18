import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
  @IsNotEmpty()
  readonly password: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly confirmPassword: string;
}
