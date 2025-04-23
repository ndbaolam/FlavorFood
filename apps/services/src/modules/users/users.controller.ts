import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@UseGuards(AdminGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getAllUsers();
  }  

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.getUserById(+id);
  }

  @Post()
  @ApiBody({ type: CreateUserDto})
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateUserDto})
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(+id);
  }
}
