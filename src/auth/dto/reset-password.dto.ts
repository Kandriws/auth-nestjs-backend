import { IsDefined, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
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
}
