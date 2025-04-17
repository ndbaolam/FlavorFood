import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/users.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserGoogleInterface } from './interfaces/user.interface';
import { Users } from '../users/entity/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  //Normal login
  async login(mail: string, password: string): Promise<{ accessToken: string }> {
    // Find user by email
    const user = await this.usersRepository.findOne({
      where: { mail },
      select: ['user_id', 'mail', 'password', 'role'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload: JwtPayload = {
      user_id: user.user_id,
      mail: user.mail,      
    }

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return { accessToken };
  }

  //Google OAuth
  async signInOAuth(user: UserGoogleInterface): Promise<string> {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user exists
    let userExists = await this.usersService.findUserByEmail(user.mail);

    // Register new user if not exists
    if (!userExists) {
      const randomPwd = Math.random().toString(36).slice(-8);

      const userRegisterDto: CreateUserDto = {
        mail: user.mail,
        password: randomPwd,
        first_name: user.firstName,
        last_name: user.lastName,
        avatar: user.avatar,
      };

      await this.register(userRegisterDto);
      userExists = await this.usersService.findUserByEmail(userRegisterDto.mail); // Re-fetch user after registration
    }

    const payload: JwtPayload = {
      user_id: userExists.user_id,
      mail: userExists.mail,      
    }
    
    // Generate access token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    return accessToken;
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async getProfile(mail: string): Promise<Users> {
    return this.usersService.findUserByEmail(mail);
  }
}
