import { MongooseModule } from "@nestjs/mongoose";
import { Permission, PermissionSchema } from "../auth/schemas/permission.schema";
import { Role, RoleSchema } from "../auth/schemas/role.schema";
import { User, UserSchema } from "../users/schemas/user.schema";
import { SeedService } from "./seed.service";
import { Module } from "@nestjs/common";

// src/modules/seed/seed.module.ts
@Module({
    imports: [
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Role.name, schema: RoleSchema },
        { name: Permission.name, schema: PermissionSchema },
      ]),
    ],
    providers: [SeedService],
  })
  export class SeedModule {}