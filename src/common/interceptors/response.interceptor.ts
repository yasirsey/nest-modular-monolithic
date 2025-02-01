import { ExecutionContext } from "@nestjs/common";
import { CallHandler } from "@nestjs/common";
import { NestInterceptor } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { CommonApiResponse } from "../interfaces/api-response.interface";

// src/common/interceptors/response.interceptor.ts
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, CommonApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<CommonApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString()
      }))
    );
  }
}
