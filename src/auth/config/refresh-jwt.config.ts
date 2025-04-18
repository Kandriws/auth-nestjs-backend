import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { envs } from 'src/common/config';
import STRATEGIES_KEYS from '../constants/strategies-keys.constant';

export default registerAs(
  STRATEGIES_KEYS.JWT_REFRESH,
  (): JwtSignOptions => ({
    secret: envs.JWT_SECRET,
    expiresIn: envs.JWT_EXPIRATION,
  }),
);
