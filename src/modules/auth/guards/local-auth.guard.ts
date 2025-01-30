import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// src/modules/auth/guards/local-auth.guard.ts
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
