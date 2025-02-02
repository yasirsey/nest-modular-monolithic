// src/modules/admin/admin.controller.ts
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { ApiCommonResponse } from "src/common/decorators/api-common-response.decorator";
import { CreateAdminDto, CreateRoleDto, CreatePermissionDto, RoleResponseDto, PermissionResponseDto } from "./dto";
import { UserDto } from "../users/dto";

@Controller('admin')
@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Post('create')
  @Roles('super-admin')
  @ApiOperation({ 
    summary: 'Create a new admin',
    description: 'Creates a new admin user with specified roles. Requires super-admin role.'
  })
  @ApiCommonResponse(UserDto, {
    status: 201,
    description: 'Admin created successfully'
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('roles')
  @Roles('super-admin')
  @ApiOperation({ 
    summary: 'Create a new role',
    description: 'Creates a new role with specified permissions. Requires super-admin role.'
  })
  @ApiCommonResponse(RoleResponseDto, {
    status: 201,
    description: 'Role created successfully'
  })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.adminService.createRole(
      createRoleDto.name, 
      createRoleDto.permissions,
      createRoleDto.description
    );
  }

  @Post('permissions')
  @Roles('super-admin')
  @ApiOperation({ 
    summary: 'Create a new permission',
    description: 'Creates a new permission. Requires super-admin role.'
  })
  @ApiCommonResponse(PermissionResponseDto, {
    status: 201,
    description: 'Permission created successfully'
  })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.adminService.createPermission(
      createPermissionDto.name,
      createPermissionDto.description
    );
  }
}