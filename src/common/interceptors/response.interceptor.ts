import { ExecutionContext } from "@nestjs/common";
import { CallHandler } from "@nestjs/common";
import { NestInterceptor } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";

// src/common/interceptors/response.interceptor.ts
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString()
      }))
    );
  }
}

