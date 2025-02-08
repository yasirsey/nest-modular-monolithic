import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiCommonResponse } from 'src/common/decorators/api-common-response.decorator';
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryDto,
  UserDto,
  UserListResponseDto,
} from './dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongoid.pipe';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('users.create')
  @ApiOperation({ summary: 'Create new user' })
  @ApiCommonResponse(UserDto, {
    status: 201,
    description: 'User created successfully',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'Get all users' })
  @ApiCommonResponse(UserListResponseDto, {
    status: 200,
    description: 'Retrieved users list successfully',
  })
  async findAll(@Query() query: UserQueryDto): Promise<UserListResponseDto> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiCommonResponse(UserDto, {
    status: 200,
    description: 'Retrieved user successfully',
  })
  async findOne(@Param('id', ParseMongoIdPipe) id: string): Promise<UserDto> {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @RequirePermissions('users.update')
  @ApiOperation({ summary: 'Update user' })
  @ApiCommonResponse(UserDto, {
    status: 200,
    description: 'User updated successfully',
  })
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions('users.delete')
  @ApiOperation({ summary: 'Delete user' })
  @ApiCommonResponse(UserDto, {
    status: 200,
    description: 'User deleted successfully',
  })
  async remove(@Param('id', ParseMongoIdPipe) id: string): Promise<UserDto> {
    return this.usersService.remove(id);
  }
}
