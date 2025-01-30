import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// src/modules/auth/guards/facebook-auth.guard.ts
@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {}
