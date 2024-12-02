import { Controller, Post, Body, UseGuards, BadRequestException, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client('807563561861-hsi53qd916easg9cflre3b45bj9ditjv.apps.googleusercontent.com');

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return { token: await this.authService.login(body.email, body.password) };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile() {
    return { message: 'This is a protected route' };
  }


  @Post('google')
  async googleAuth2(@Body() body: { token: string }) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: body.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new BadRequestException('Invalid Google token');
      }

      // Extract user data from Google
      const { email, name, picture } = payload;

      // Perform additional logic (e.g., create or find user in DB)
      const user = { email, name, picture }; // Mock user object
      console.log('Authenticated Google User:', user);

      // Generate JWT token for authenticated user
      const jwtToken = 'YOUR_JWT_GENERATION_LOGIC'; // Replace with real JWT logic
      return { token: jwtToken, user };
    } catch (error) {
      console.error('Error in Google Auth:', error);
      throw new BadRequestException('Google Authentication Failed');
    }
  }


  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirects to Google for authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    // Handle the authenticated user's data
    return {
      message: 'Google Authentication Successful',
      user: req.user,
    };
  }
  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req) {
  //   const user = await this.authService.validateGoogleUser(req.user);
  //   return this.authService.loginWithGoogle(user);
  // }

  

}