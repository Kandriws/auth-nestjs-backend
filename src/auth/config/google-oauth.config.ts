import { registerAs } from '@nestjs/config';
import STRATEGIES_KEYS from '../constants/strategies-keys.constant';
import { envs } from 'src/common/config';

export default registerAs(STRATEGIES_KEYS.GOOGLE_OAUTH, () => ({
  clinetID: envs.GOOGLE_CLIENT_ID,
  clientSecret: envs.GOOGLE_CLIENT_SECRET,
  callbackURL: envs.GOOGLE_CALLBACK_URL,
}));
