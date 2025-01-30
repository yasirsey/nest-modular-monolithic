// src/modules/users/users.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../admin/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @RequirePermissions('users.create')
    @ApiOperation({ summary: 'Create new user' })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @RequirePermissions('users.read')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string
    ) {
        return this.usersService.findAll({
            page: Number(page),
            limit: Number(limit),
            search
        });
    }

    @Get(':id')
    @RequirePermissions('users.read')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, description: 'Return found user.' })
    async findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Put(':id')
    @RequirePermissions('users.update')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @RequirePermissions('users.delete')
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
