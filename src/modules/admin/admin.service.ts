import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Permission, PermissionDocument } from "../auth/schemas/permission.schema";
import { Role, RoleDocument } from "../auth/schemas/role.schema";
import { User, UserDocument } from "../users/schemas/user.schema";
import { Model } from "mongoose";
import { I18nService } from "nestjs-i18n";
import { CreateAdminDto } from "./dto/create-admin.dto";
import * as bcrypt from 'bcrypt';

// src/modules/admin/admin.service.ts
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    private i18nService: I18nService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { email, password, roles } = createAdminDto;

    // Email kontrolü
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(
        await this.i18nService.translate('admin.emailExists')
      );
    }

    // Rolleri kontrol et
    const validRoles = await this.roleModel.find({ _id: { $in: roles } });
    if (validRoles.length !== roles.length) {
      throw new BadRequestException(
        await this.i18nService.translate('admin.invalidRoles')
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

    return newAdmin.save();
  }

  async createRole(name: string, permissions: string[]) {
    const existingRole = await this.roleModel.findOne({ name });
    if (existingRole) {
      throw new BadRequestException(
        await this.i18nService.translate('admin.roleExists')
      );
    }

    // İzinleri kontrol et
    const validPermissions = await this.permissionModel.find({ 
      _id: { $in: permissions } 
    });
    if (validPermissions.length !== permissions.length) {
      throw new BadRequestException(
        await this.i18nService.translate('admin.invalidPermissions')
      );
    }

    const newRole = new this.roleModel({
      name,
      permissions: validPermissions.map(p => p._id),
    });

    return newRole.save();
  }

  async createPermission(name: string, description: string) {
    const existingPermission = await this.permissionModel.findOne({ name });
    if (existingPermission) {
      throw new BadRequestException(
        await this.i18nService.translate('admin.permissionExists')
      );
    }

    const newPermission = new this.permissionModel({
      name,
      description,
    });

    return newPermission.save();
  }
}
