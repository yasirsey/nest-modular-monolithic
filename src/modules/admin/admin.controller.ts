import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "./guards/roles.guard";
import { AdminService } from "./admin.service";
import { Roles } from "./decorators/roles.decorator";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

// src/modules/admin/admin.controller.ts
@Controller('admin')
@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Post('create')
  @Roles('super-admin')
  @ApiOperation({ summary: 'Create a new admin' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  @Post('roles')
  @Roles('super-admin')
  @ApiOperation({ summary: 'Create a new role' })
  async createRole(
    @Body('name') name: string,
    @Body('permissions') permissions: string[],
  ) {
    return this.adminService.createRole(name, permissions);
  }

  @Post('permissions')
  @Roles('super-admin')
  @ApiOperation({ summary: 'Create a new permission' })
  async createPermission(
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    return this.adminService.createPermission(name, description);
  }
}
