// src/modules/auth/auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private i18nService: I18nService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user && user.password && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async session(userId: string): Promise<any> {
        return await this.usersService.findById(userId);
    }

    async login(user: any) {
        // Ensure required fields exist in the payload
        const payload = {
            email: user.email,
            sub: user._id.toString(),
            roles: user.roles || ['user'],
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                payload,
                {
                    secret: this.configService.get<string>('jwt.secret'),
                    expiresIn: this.configService.get<string>('jwt.accessExpiration', '15m'),
                }
            ),
            this.jwtService.signAsync(
                payload,
                {
                    secret: this.configService.get<string>('jwt.secret'),
                    expiresIn: this.configService.get<string>('jwt.refreshExpiration', '7d'),
                }
            ),
        ]);

        // Ensure we use the correct ID format when updating refresh token
        const userId = user._id.toString()
        await this.usersService.updateRefreshToken(userId, refreshToken);

        // Return both tokens and user info
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: userId,
                email: user.email,
                roles: user.roles || ['user'],
                firstName: user.firstName,
                lastName: user.lastName,
            }
        };
    }

    async register(registerDto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException(
                await this.i18nService.translate('auth.EMAIL_ALDREADY_EXIST')
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create user with default role and local provider
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
            provider: 'local',
        });

        // Generate tokens
        return this.login(user);
    }

    async refreshToken(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException(
                await this.i18nService.translate('auth.invalidRefreshToken')
            );
        }

        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.refreshToken
        );

        if (!isRefreshTokenValid) {
            throw new UnauthorizedException(
                await this.i18nService.translate('auth.invalidRefreshToken')
            );
        }

        const payload = { email: user.email, sub: user.id };
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: this.configService.get('jwt.accessExpiration'),
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: this.configService.get('jwt.refreshExpiration'),
            }),
        ]);

        await this.usersService.updateRefreshToken(user.id, newRefreshToken);

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }

    async validateOAuthUser(profile: any, provider: string) {
        const email = profile.emails[0].value;
        let user = await this.usersService.findByEmail(email);

        if (!user) {
            user = await this.usersService.create({
                email,
                provider,
                providerId: profile.id,
                firstName: profile.name?.givenName,
                lastName: profile.name?.familyName,
            });
        }

        return user;
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId, null);
        return { success: true };
    }
}

