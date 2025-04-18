import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ResponseUserDto } from './response-user.dto';

export class ResponseUserWithHashDto extends ResponseUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly hashedRefreshToken: string;
}
