import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export type GoogelAuthResponseType = Readonly<{
  success: boolean;
  message: string;
  user: ResponseUserDto;
}>;
