import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export type AuthResponseType = Readonly<{
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  user: ResponseUserDto;
}>;
