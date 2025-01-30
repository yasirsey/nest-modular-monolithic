import { SetMetadata } from "@nestjs/common";

// src/modules/admin/decorators/roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
