import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// src/modules/auth/guards/apple-auth.guard.ts
@Injectable()
export class AppleAuthGuard extends AuthGuard('apple') {}
