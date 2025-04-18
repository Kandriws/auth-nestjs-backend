import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly name;
}
