import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    private readonly configService: ConfigService,    
    private readonly usersServices: UsersService,
  ) {
    const extractJwtFromCookie = (req: Request) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['access_token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };

    super({
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: extractJwtFromCookie,
    });
  }

  async validate(payload: JwtPayload) {    
    const user = await this.usersServices.findUserByEmail(payload.mail);

    if (!user) {
      throw new UnauthorizedException('Please log in to continue');
    }

    if(user['role'] !== 'admin') {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }

    return {
      sub: payload.user_id,
      mail: payload.mail,      
    };
  }
}