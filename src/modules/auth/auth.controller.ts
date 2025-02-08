import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { GetUser } from './decorators/get-user.decorator';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { AppleAuthGuard } from './guards/apple-auth.guard';

// Import DTOs
import { RegisterRequestDto } from './dto/request/register.request.dto';
import { LoginRequestDto } from './dto/request/login.request.dto';
import { RefreshTokenRequestDto } from './dto/request/refresh-token.request.dto';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { SessionResponseDto } from './dto/response/session.response.dto';
import { LogoutResponseDto } from './dto/response/logout.response.dto';
import { ApiCommonResponse } from 'src/common/decorators/api-common-response.decorator';
import { ChangePasswordRequestDto } from './dto/request/change-password.request.dto';
import { UpdateProfileDto } from './dto/request/update-profile.request.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCommonResponse(AuthResponseDto, {
    status: 201,
    description: 'User successfully registered',
    excludeStatuses: [401], // Public endpoint
  })
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiCommonResponse(AuthResponseDto, {
    status: 200,
    description: 'User successfully logged in',
    excludeStatuses: [401], // Public endpoint but uses LocalAuthGuard
  })
  async login(
    @Body() loginDto: LoginRequestDto,
    @Request() req,
  ): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCommonResponse(AuthResponseDto, {
    status: 200,
    description: 'Tokens successfully refreshed',
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenRequestDto,
    @GetUser('id') userId: string,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(userId, refreshTokenDto.refresh_token);
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user session' })
  @ApiCommonResponse(SessionResponseDto, {
    status: 200,
    description: 'Session retrieved successfully',
  })
  async session(@GetUser('id') userId: string): Promise<SessionResponseDto> {
    return this.authService.session(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiCommonResponse(SessionResponseDto)
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<SessionResponseDto> {
    return this.authService.updateProfile(userId, updateProfileDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiCommonResponse(LogoutResponseDto, {
    status: 200,
    description: 'Password changed successfully',
  })
  async changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordRequestDto,
  ): Promise<LogoutResponseDto> {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiCommonResponse(LogoutResponseDto, {
    status: 200,
    description: 'User successfully logged out',
  })
  async logout(@GetUser('id') userId: string): Promise<LogoutResponseDto> {
    return this.authService.logout(userId);
  }

  // OAuth Routes
  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Login with Google' })
  @ApiCommonResponse(null, {
    status: 200,
    description: 'Redirects to Google login',
    excludeStatuses: [401], // Public endpoint
  })
  async googleAuth() {
    // Google OAuth
  }

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiCommonResponse(AuthResponseDto, {
    status: 200,
    description: 'Google login successful',
    excludeStatuses: [401], // Public endpoint with OAuth guard
  })
  async googleAuthCallback(@Request() req): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  @Get('facebook')
  @Public()
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Login with Facebook' })
  @ApiCommonResponse(null, {
    status: 200,
    description: 'Redirects to Facebook login',
    excludeStatuses: [401], // Public endpoint
  })
  async facebookAuth() {
    // Facebook OAuth
  }

  @Get('facebook/callback')
  @Public()
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Facebook OAuth callback' })
  @ApiCommonResponse(AuthResponseDto, {
    status: 200,
    description: 'Facebook login successful',
    excludeStatuses: [401], // Public endpoint with OAuth guard
  })
  async facebookAuthCallback(@Request() req): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  @Get('apple')
  @Public()
  @UseGuards(AppleAuthGuard)
  @ApiOperation({ summary: 'Login with Apple' })
  @ApiCommonResponse(null, {
    status: 200,
    description: 'Redirects to Apple login',
    excludeStatuses: [401], // Public endpoint
  })
  async appleAuth() {
    // Apple OAuth
  }

  @Get('apple/callback')
  @Public()
  @UseGuards(AppleAuthGuard)
  @ApiOperation({ summary: 'Apple OAuth callback' })
  @ApiCommonResponse(AuthResponseDto, {
    status: 200,
    description: 'Apple login successful',
    excludeStatuses: [401], // Public endpoint with OAuth guard
  })
  async appleAuthCallback(@Request() req): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }
}
