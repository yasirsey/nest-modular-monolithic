import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

import { RegisterRequestDto } from './dto/request/register.request.dto';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { SessionResponseDto } from './dto/response/session.response.dto';
import { LogoutResponseDto } from './dto/response/logout.response.dto';
import { UserDto } from '../users/dto/response/user.dto';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto';
import { UpdateProfileDto } from './dto/request/update-profile.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private i18nService: I18nService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async session(userId: string): Promise<SessionResponseDto> {
    const user = await this.usersService.findById(userId);
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      permissions: user.permissions,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(user: any): Promise<AuthResponseDto> {
    const payload = {
      email: user.email,
      sub: user.id || user._id.toString(),
      roles: user.roles,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>(
          'jwt.accessExpiration',
          '15m',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>(
          'jwt.refreshExpiration',
          '7d',
        ),
      }),
    ]);

    const userId = user.id || user._id.toString();
    await this.usersService.updateRefreshToken(userId, refreshToken);

    const userDto: UserDto = {
      id: userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      permissions: user.permissions,
      isEmailVerified: user.isEmailVerified || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      provider: user.provider,
      lastLoginAt: user.lastLoginAt,
    };

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userDto,
    };
  }

  async register(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException(
        await this.i18nService.translate('auth.EMAIL_ALREADY_EXISTS'),
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      provider: 'local',
    });

    return this.login(user);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordRequestDto,
  ): Promise<LogoutResponseDto> {
    const user = await this.usersService.findByIdWithPassword(userId);

    // Validate current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        await this.i18nService.translate('auth.CURRENT_PASSWORD_INCORRECT'),
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    await this.usersService.update(userId, { password: hashedPassword });

    // Logout from all devices
    await this.logout(userId);

    return { success: true };
  }

  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        await this.i18nService.translate('auth.INVALID_REFRESH_TOKEN'),
      );
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException(
        await this.i18nService.translate('auth.INVALID_REFRESH_TOKEN'),
      );
    }

    return this.login(user);
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileDto,
  ): Promise<SessionResponseDto> {
    await this.usersService.update(userId, data);
    return this.session(userId);
  }

  async validateOAuthUser(profile: any, provider: string): Promise<any> {
    // const email = profile.emails[0].value;
    // let user = await this.usersService.findByEmail(email);
    // if (!user) {
    //     const createUserDto: CreateUserDto = {
    //         email,
    //         firstName: profile.name?.givenName,
    //         lastName: profile.name?.familyName,
    //         provider,
    //         providerId: profile.id,
    //     };
    //     user = await this.usersService.create(createUserDto);
    // }
    // return user;
  }

  async logout(userId: string): Promise<LogoutResponseDto> {
    await this.usersService.updateRefreshToken(userId, null);
    return { success: true };
  }
}
