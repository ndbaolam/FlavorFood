import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users, UserStatus } from './entity/users.entity';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getAllUsers(): Promise<Users[]> {
    return await this.usersRepository.find({
      select: [
        'user_id',
        'mail',
        'first_name',
        'last_name',
        'avatar',
        'role',
        'status',
        'expired_at',
        'created_at',
        'updated_at',
      ],
    });
  }

  async searchUsers(mail: string, status: UserStatus): Promise<Users[]> {
    return await this.usersRepository.find({
      where: {
        mail: mail ? `%${mail}%` : undefined,
        status: status !== undefined ? status : undefined,
      },
      select: [
        'user_id',
        'mail',
        'first_name',
        'last_name',
        'avatar',
        'role',
        'status',
        'expired_at',
        'created_at',
        'updated_at',
      ],
    });
  }

  async getUserById(userId: number): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
      select: [
        'user_id',
        'mail',
        'first_name',
        'last_name',
        'avatar',
        'role',
        'status',
        'expired_at',
        'created_at',
        'updated_at',
      ],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const existingUser = await this.usersRepository.findOne({
      where: { mail: createUserDto.mail },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    const user = await this.getUserById(userId);
    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return await this.usersRepository.save(updatedUser);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.getUserById(userId);
    await this.usersRepository.remove(user);
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return await this.usersRepository.findOne({
      where: { mail: email },
      select: [
        'user_id',
        'mail',
        'first_name',
        'last_name',
        'avatar',
        'role',
        'status',
        'expired_at',
        'created_at',
        'updated_at',
      ],
    });
  }
}
