import { Role } from "../schemas/role.schema";

// src/modules/auth/interfaces/auth.interface.ts
export interface ValidateUserResponse {
    id: string;
    email: string;
    roles: Role[];
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
}
