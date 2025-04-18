import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export class ResponseAuthDto {
  success: boolean;
  message: string;
  token: string;
  user: ResponseUserDto;
}
