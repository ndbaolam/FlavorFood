import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/users.dto';
import * as env from '../config/configuration';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(mail: string, password: string): Promise<{ accessToken: Promise<string> }> {
    const user = await this.usersService.findUserByEmail(mail);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userMail: user.mail, userRole: user.role };
    const accessToken = this.jwtService.signAsync(payload, {
      secret: env.default().jwt.JWT_SECRET,            
    });

    return { accessToken };
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
