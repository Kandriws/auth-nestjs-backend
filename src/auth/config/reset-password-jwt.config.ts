import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { envs } from 'src/common/config';

export default registerAs(
  'reset-password-jwt',
  (): JwtSignOptions => ({
    secret: envs.JWT_RESET_SECRET,
    expiresIn: envs.JWT_EXPIRATION,
  }),
);
