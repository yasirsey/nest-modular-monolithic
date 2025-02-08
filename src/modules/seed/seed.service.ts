import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Permission,
  PermissionDocument,
} from '../auth/schemas/permission.schema';
import { Role, RoleDocument } from '../auth/schemas/role.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// src/modules/seed/seed.service.ts
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedPermissions();
    await this.seedRoles();
    await this.seedSuperAdmin();
  }

  private async seedPermissions() {
    const defaultPermissions = [
      { name: 'users.create', description: 'Create users' },
      { name: 'users.read', description: 'Read users' },
      { name: 'users.update', description: 'Update users' },
      { name: 'users.delete', description: 'Delete users' },
      { name: 'roles.create', description: 'Create roles' },
      { name: 'roles.read', description: 'Read roles' },
      { name: 'roles.update', description: 'Update roles' },
      { name: 'roles.delete', description: 'Delete roles' },
    ];

    for (const permission of defaultPermissions) {
      await this.permissionModel.findOneAndUpdate(
        { name: permission.name },
        permission,
        { upsert: true },
      );
    }
  }

  private async seedRoles() {
    const permissions = await this.permissionModel.find();

    const defaultRoles = [
      {
        name: 'super-admin',
        permissions: permissions.map((p) => p._id),
        description: 'Super Administrator',
      },
      {
        name: 'admin',
        permissions: permissions
          .filter((p) => !p.name.includes('delete'))
          .map((p) => p._id),
        description: 'Administrator',
      },
      {
        name: 'user',
        permissions: permissions
          .filter((p) => p.name.startsWith('users.read'))
          .map((p) => p._id),
        description: 'Regular User',
      },
    ];

    for (const role of defaultRoles) {
      await this.roleModel.findOneAndUpdate({ name: role.name }, role, {
        upsert: true,
      });
    }
  }

  private async seedSuperAdmin() {
    const superAdminRole = await this.roleModel.findOne({
      name: 'super-admin',
    });
    if (!superAdminRole) return;

    const superAdminEmail = this.configService.get('SUPER_ADMIN_EMAIL');
    const superAdminPassword = this.configService.get('SUPER_ADMIN_PASSWORD');

    if (!superAdminEmail || !superAdminPassword) {
      console.warn(
        'Super admin credentials not found in environment variables',
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    await this.userModel.findOneAndUpdate(
      { email: superAdminEmail },
      {
        email: superAdminEmail,
        firstName: 'Super',
        lastName: 'Admin',
        phone: {
          countryCode: '+90',
          number: '5555555555',
        },
        password: hashedPassword,
        roles: [superAdminRole._id],
        isActive: true,
        provider: 'local',
      },
      { upsert: true },
    );
  }
}
