import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { AppleAuthGuard } from './guards/apple-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Local Authentication
  @Post('register')
  @ApiOperation({ summary: 'Înregistrare utilizator nou', description: 'Creează un cont nou și returnează JWT token' })
  @ApiResponse({ status: 201, description: 'Utilizator creat cu succes', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Date invalide' })
  @ApiResponse({ status: 409, description: 'Email-ul există deja' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    return this.authService.login(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentificare utilizator', description: 'Autentificare cu email și parolă' })
  @ApiResponse({ status: 200, description: 'Autentificare reușită', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Credențiale invalide' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(req.user);
    return result;
  }

  // Social Authentication
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Autentificare Google OAuth', description: 'Redirecționează către Google pentru autentificare' })
  @ApiResponse({ status: 302, description: 'Redirect către Google OAuth' })
  async googleAuth(@Request() req) {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Callback Google OAuth' })
  @ApiResponse({ status: 302, description: 'Redirect către frontend cu token' })
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const result = await this.authService.login(req.user);
    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Autentificare Facebook OAuth', description: 'Redirecționează către Facebook pentru autentificare' })
  @ApiResponse({ status: 302, description: 'Redirect către Facebook OAuth' })
  async facebookAuth(@Request() req) {
    // Guard redirects to Facebook
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Callback Facebook OAuth' })
  @ApiResponse({ status: 302, description: 'Redirect către frontend cu token' })
  async facebookAuthRedirect(@Request() req, @Res() res: Response) {
    const result = await this.authService.login(req.user);
    res.redirect(`http://localhost:3000/auth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`);
  }

  @Get('apple')
  @UseGuards(AppleAuthGuard)
  @ApiOperation({ summary: 'Autentificare Apple OAuth', description: 'Redirecționează către Apple pentru autentificare' })
  @ApiResponse({ status: 302, description: 'Redirect către Apple OAuth' })
  async appleAuth(@Request() req) {
    // Guard redirects to Apple
  }

  @Get('apple/callback')
  @UseGuards(AppleAuthGuard)
  @ApiOperation({ summary: 'Callback Apple OAuth' })
  @ApiResponse({ status: 302, description: 'Redirect către frontend cu token' })
  async appleAuthRedirect(@Request() req, @Res() res: Response) {
    const result = await this.authService.login(req.user);
    res.redirect(`http://localhost:3000/auth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`);
  }

  // Protected route example
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obține profilul utilizatorului autentificat', description: 'Returnează datele utilizatorului curent (necesită JWT token)' })
  @ApiResponse({ status: 200, description: 'Profil utilizator' })
  @ApiResponse({ status: 401, description: 'Neautorizat - token invalid sau lipsă' })
  getProfile(@Request() req) {
    return req.user;
  }

  // Logout (client-side token removal)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deconectare', description: 'Deconectare utilizator (token-ul se șterge client-side)' })
  @ApiResponse({ status: 200, description: 'Deconectat cu succes' })
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
