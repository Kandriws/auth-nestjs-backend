import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import STRATEGIES_KEYS from '../constants/strategies-keys.constant';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(STRATEGIES_KEYS.GOOGLE_OAUTH) {}
