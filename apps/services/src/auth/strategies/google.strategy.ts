import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserGoogleInterface } from '../interfaces/user.interface';
import { GoogleProfile } from '../interfaces/google.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URI'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user: UserGoogleInterface = {
      provider: 'google',
      providerId: id,
      mail: emails[0].value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      avatar: photos[0]?.value,
    };

    // Perform any additional checks or user creation logic here
    done(null, user);
  }
}
