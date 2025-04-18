import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { envs } from 'src/common/config';
import STRATEGIES_KEYS from '../constants/strategies-keys.constant';

export default registerAs(
  STRATEGIES_KEYS.JWT,
  (): JwtModuleOptions => ({
    secret: envs.JWT_SECRET,
    signOptions: { expiresIn: envs.JWT_EXPIRATION },
  }),
);
