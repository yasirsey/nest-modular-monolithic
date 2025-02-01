import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { ApiResponseType } from 'src/common/decorators/api-response.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponseType(AuthResponseDto)
    @ApiResponse({ status: 201, description: 'User successfully registered', type: AuthResponseDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async register(@Body() registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiResponseType(AuthResponseDto)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'User successfully logged in', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginDto: LoginRequestDto, @Request() req): Promise<AuthResponseDto> {
        return this.authService.login(req.user);
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponseType(AuthResponseDto)
    @ApiResponse({ status: 200, description: 'Tokens successfully refreshed', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenRequestDto,
        @GetUser('id') userId: string,
    ): Promise<AuthResponseDto> {
        return this.authService.refreshToken(userId, refreshTokenDto.refresh_token);
    }

    @Get('session')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponseType(SessionResponseDto)
    @ApiOperation({ summary: 'Get current user session' })
    @ApiResponse({ status: 200, description: 'Session retrieved successfully', type: SessionResponseDto })
    async session(@GetUser('id') userId: string): Promise<SessionResponseDto> {
        return this.authService.session(userId);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponseType(LogoutResponseDto)
    @ApiResponse({ status: 200, description: 'User successfully logged out', type: LogoutResponseDto })
    async logout(@GetUser('id') userId: string): Promise<LogoutResponseDto> {
        return this.authService.logout(userId);
    }

    // OAuth Routes
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Login with Google' })
    @ApiResponse({ status: 200, description: 'Redirects to Google login' })
    async googleAuth() {
        // Google OAuth
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Google OAuth callback' })
    @ApiResponse({ status: 200, description: 'Google login successful', type: AuthResponseDto })
    async googleAuthCallback(@Request() req): Promise<AuthResponseDto> {
        return this.authService.login(req.user);
    }

    @Get('facebook')
    @UseGuards(FacebookAuthGuard)
    @ApiOperation({ summary: 'Login with Facebook' })
    @ApiResponse({ status: 200, description: 'Redirects to Facebook login' })
    async facebookAuth() {
        // Facebook OAuth
    }

    @Get('facebook/callback')
    @UseGuards(FacebookAuthGuard)
    @ApiOperation({ summary: 'Facebook OAuth callback' })
    @ApiResponse({ status: 200, description: 'Facebook login successful', type: AuthResponseDto })
    async facebookAuthCallback(@Request() req): Promise<AuthResponseDto> {
        return this.authService.login(req.user);
    }

    @Get('apple')
    @UseGuards(AppleAuthGuard)
    @ApiOperation({ summary: 'Login with Apple' })
    @ApiResponse({ status: 200, description: 'Redirects to Apple login' })
    async appleAuth() {
        // Apple OAuth
    }

    @Get('apple/callback')
    @UseGuards(AppleAuthGuard)
    @ApiOperation({ summary: 'Apple OAuth callback' })
    @ApiResponse({ status: 200, description: 'Apple login successful', type: AuthResponseDto })
    async appleAuthCallback(@Request() req): Promise<AuthResponseDto> {
        return this.authService.login(req.user);
    }
}
