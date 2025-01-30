import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy as GoogleStrategy20 } from 'passport-google-oauth20';

// src/modules/auth/strategies/google.strategy.ts
@Injectable()
export class GoogleStrategy extends PassportStrategy(GoogleStrategy20, 'google') {
    constructor(
        configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get('oauth.google.clientId'),
            clientSecret: configService.get('oauth.google.clientSecret'),
            callbackURL: configService.get('oauth.google.callbackUrl'),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ) {
        const user = await this.authService.validateOAuthUser(profile, 'google');
        return user;
    }
}
