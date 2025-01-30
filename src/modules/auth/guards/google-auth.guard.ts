import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// src/modules/auth/guards/google-auth.guard.ts
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    constructor() {
        super({
            accessType: 'offline',
            prompt: 'select_account'
        });
    }
}