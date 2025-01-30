// src/modules/auth/interfaces/token.interface.ts
import { Role } from '../schemas/role.schema';

export interface TokenPayload {
    email: string;
    sub: string;
    roles: Role[];
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        roles: Role[];
        firstName?: string;
        lastName?: string;
        isEmailVerified?: boolean;
    };
}
