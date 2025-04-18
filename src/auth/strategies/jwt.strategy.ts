import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { envs } from 'src/common/config';
import STRATEGIES_KEYS from '../constants/strategies-keys.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_KEYS.JWT,
) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }
    return user;
  }
}
