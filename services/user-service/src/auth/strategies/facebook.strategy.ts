import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_ID'),
      clientSecret: configService.get('FACEBOOK_APP_SECRET'),
      callbackURL: configService.get('FACEBOOK_CALLBACK_URL'),
      scope: ['email', 'public_profile'],
      profileFields: ['emails', 'name', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos, id } = profile;

      const user = {
        email: emails ? emails[0].value : `${id}@facebook.com`,
        firstName: name.givenName || name,
        lastName: name.familyName || '',
        avatar: photos && photos[0] ? photos[0].value : null,
        providerId: id,
        providerData: profile,
      };

      const validatedUser = await this.authService.validateSocialUser(
        user,
        'FACEBOOK',
      );

      done(null, validatedUser);
    } catch (error) {
      done(error, null);
    }
  }
}
