import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { UsersService } from "../users/users.service";
import { GetUser } from "./decorators/get-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { FacebookAuthGuard } from "./guards/facebook-auth.guard";
import { AppleAuthGuard } from "./guards/apple-auth.guard";
import { Public } from "./decorators/public.decorator";

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) { }

    // Public Endpoints - No Guard needed
    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // Local Authentication
    @Post('login')
    @Public()
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'User successfully logged in' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() loginDto: LoginDto, @Request() req) {
        return this.authService.login(req.user);
    }

    // JWT Protected Routes
    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens successfully refreshed' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshToken(
        @Body('refresh_token') refreshToken: string,
        @GetUser('id') userId: string,
    ) {
        return this.authService.refreshToken(userId, refreshToken);
    }

    @Get('session')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user session' })
    @ApiResponse({ status: 200, description: 'Session retrieved successfully' })
    async session(@GetUser('id') userId: string) {
        return this.authService.session(userId);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'User successfully logged out' })
    async logout(@GetUser('id') userId: string) {
        return this.authService.logout(userId);
    }

    // OAuth Routes
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Login with Google' })
    async googleAuth() {
        // Google OAuth
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    @ApiOperation({ summary: 'Google OAuth callback' })
    async googleAuthCallback(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('facebook')
    @UseGuards(FacebookAuthGuard)
    @ApiOperation({ summary: 'Login with Facebook' })
    async facebookAuth() {
        // Facebook OAuth
    }

    @Get('facebook/callback')
    @UseGuards(FacebookAuthGuard)
    @ApiOperation({ summary: 'Facebook OAuth callback' })
    async facebookAuthCallback(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('apple')
    @UseGuards(AppleAuthGuard)
    @ApiOperation({ summary: 'Login with Apple' })
    async appleAuth() {
        // Apple OAuth
    }

    @Get('apple/callback')
    @UseGuards(AppleAuthGuard)
    @ApiOperation({ summary: 'Apple OAuth callback' })
    async appleAuthCallback(@Request() req) {
        return this.authService.login(req.user);
    }
}