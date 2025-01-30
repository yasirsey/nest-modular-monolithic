// src/modules/admin/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.userModel
      .findById(request.user.id)
      .populate('roles')
      .exec();

    if (!user) return false;

    // Super-admin her şeyi yapabilir
    if (user.roles.some(role => role.name === 'super-admin')) {
      return true;
    }

    const userPermissions = user.roles.flatMap(role => role.permissions);
    const requiredPermissions = roles.flatMap(role => {
      switch(role) {
        case 'admin':
          return ['users.manage', 'roles.view'];
        case 'manager':
          return ['users.view', 'roles.view'];
        default:
          return [];
      }
    });

    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  }
}
