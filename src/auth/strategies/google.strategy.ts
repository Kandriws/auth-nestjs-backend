import { PassportStrategy } from '@nestjs/passport';
import { Inject } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import STRATEGIES_KEYS from '../constants/strategies-keys.constant';
import googleOauthConfig from '../config/google-oauth.config';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class GoogleStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_KEYS.GOOGLE_OAUTH,
) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfig: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clinetID,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { displayName, emails } = profile;

      const userPayload: CreateUserDto = {
        name: displayName,
        email: emails?.[0]?.value,
        avatarUrl: profile?.photos?.[0]?.value,
        password: Math.random().toString(36).slice(-8),
      };

      const user = await this.authService.validateGoogleUser(userPayload);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
