import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import STRATEGIES_KEYS from '../constants/strategies-keys.constant';

@Injectable()
export class RefreshAuthGuard extends AuthGuard(STRATEGIES_KEYS.JWT_REFRESH) {}
