import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserStatus } from './entity/users.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng được trả về.' })
  async getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', type: Number })
  async getUser(@Param('id') id: number) {
    return this.usersService.getUserById(+id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm người dùng theo email và trạng thái' })
  @ApiQuery({ name: 'mail', required: false, description: 'Địa chỉ email' })
  @ApiQuery({ name: 'status', enum: UserStatus, required: false })
  async searchUsers(
    @Query('mail') mail: string,
    @Query('status') status: UserStatus
  ) {
    return this.usersService.searchUsers(mail, status);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá người dùng theo ID' })
  @ApiParam({ name: 'id', type: Number })
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(+id);
  }
}
