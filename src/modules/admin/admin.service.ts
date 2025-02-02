// src/modules/admin/admin.service.ts
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Permission, PermissionDocument } from "../auth/schemas/permission.schema";
import { Role, RoleDocument } from "../auth/schemas/role.schema";
import { User, UserDocument } from "../users/schemas/user.schema";
import { Model } from "mongoose";
import { I18nService } from "nestjs-i18n";
import { CreateAdminDto } from "./dto";
import { UserDto } from "../users/dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    private i18nService: I18nService,
  ) {}

  private mapUserToDto(user: UserDocument): UserDto {
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles?.map(role => typeof role === 'string' ? role : role.name),
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  private mapRoleToDto(role: RoleDocument) {
    return {
      id: role._id.toString(),
      name: role.name,
      permissions: role.permissions,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };
  }

  private mapPermissionToDto(permission: PermissionDocument) {
    return {
      id: permission._id.toString(),
      name: permission.name,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt
    };
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<UserDto> {
    const { email, password, roles } = createAdminDto;

    // Email kontrolü
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException(
        await this.i18nService.translate('admin.EMAIL_ALREADY_EXISTS')
      );
    }

    // Rolleri kontrol et
    const validRoles = await this.roleModel.find({ _id: { $in: roles } });
    if (validRoles.length !== roles.length) {
      throw new BadRequestException(
        await this.i18nService.translate('admin.INVALID_ROLES')
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni admin oluştur
    const newAdmin = new this.userModel({
      email,
      password: hashedPassword,
      roles: validRoles.map(role => role._id),
      isAdmin: true,
    });

    const savedAdmin = await newAdmin.save();
    return this.mapUserToDto(savedAdmin);
  }

  async createRole(name: string, permissions: string[], description?: string) {
    const existingRole = await this.roleModel.findOne({ name });
    if (existingRole) {
      throw new ConflictException(
        await this.i18nService.translate('admin.ROLE_ALREADY_EXISTS')
      );
    }

    // İzinleri kontrol et
    const validPermissions = await this.permissionModel.find({ 
      _id: { $in: permissions } 
    });
    if (validPermissions.length !== permissions.length) {
      throw new BadRequestException(
        await this.i18nService.translate('admin.INVALID_PERMISSIONS')
      );
    }

    const newRole = new this.roleModel({
      name,
      permissions: validPermissions.map(p => p._id),
      description
    });

    const savedRole = await newRole.save();
    return this.mapRoleToDto(savedRole);
  }

  async createPermission(name: string, description: string) {
    const existingPermission = await this.permissionModel.findOne({ name });
    if (existingPermission) {
      throw new ConflictException(
        await this.i18nService.translate('admin.PERMISSION_ALREADY_EXISTS')
      );
    }

    const newPermission = new this.permissionModel({
      name,
      description,
    });

    const savedPermission = await newPermission.save();
    return this.mapPermissionToDto(savedPermission);
  }
}