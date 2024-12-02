import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID, // Add your Google Client ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Add your Google Client Secret
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, emails, displayName, photos } = profile;
        const user = {
            googleId: id,
            email: emails[0].value,
            name: displayName,
            avatar: photos[0]?.value,
        };
        done(null, user); // Pass the user data to the next stage
    }
}
