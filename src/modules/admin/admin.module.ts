import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/schemas/user.schema";
import { Role, RoleSchema } from "../auth/schemas/role.schema";
import { Permission, PermissionSchema } from "../auth/schemas/permission.schema";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { RolesGuard } from "../auth/guards/roles.guard";

// src/modules/admin/admin.module.ts
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Role.name, schema: RoleSchema },
            { name: Permission.name, schema: PermissionSchema },
        ]),
    ],
    providers: [AdminService, RolesGuard],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule { }
