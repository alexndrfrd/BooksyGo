import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('APPLE_CLIENT_ID'),
      teamID: configService.get('APPLE_TEAM_ID'),
      keyID: configService.get('APPLE_KEY_ID'),
      privateKey: configService.get('APPLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      callbackURL: configService.get('APPLE_CALLBACK_URL'),
      scope: ['email', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    idToken: any,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      // Apple provides user info in idToken or profile
      const email = idToken?.email || profile?.emails?.[0]?.value;
      const firstName = profile?.name?.firstName || 'Apple';
      const lastName = profile?.name?.lastName || 'User';
      const providerId = idToken?.sub || profile?.id;

      const user = {
        email: email || `${providerId}@apple.com`,
        firstName,
        lastName,
        avatar: undefined, // Apple doesn't provide avatar
        providerId,
        providerData: { idToken, profile },
      };

      const validatedUser = await this.authService.validateSocialUser(
        user,
        'APPLE',
      );

      done(null, validatedUser);
    } catch (error) {
      done(error, null);
    }
  }
}
