import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
  UseGuards,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CreateUserDto } from '../users/dto/users.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { UserGoogleInterface } from './interfaces/user.interface';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,    
  ) {}  

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('google/callback')  
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req?.user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const accessToken: string = await this.authService.signInOAuth(req.user as UserGoogleInterface);
  
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000, //ms
      });
      
      return res.status(HttpStatus.OK).json({ message: 'Login successful' });
    } catch (error) {
      Logger.error('Error during Google OAuth:', error);
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Invalid' });
    }    
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('mail') mail: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ access_token: string }> {
    const { accessToken } = await this.authService.login(mail, password);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000, //ms
    });

    return {
      access_token: accessToken,
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
  }  

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request) {
    return this.authService.getProfile(req.user['mail']);
  }
}
