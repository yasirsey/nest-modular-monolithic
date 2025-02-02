// src/common/decorators/api-common-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiResponseOptions,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  ValidationErrorDto,
  UnauthorizedErrorDto,
  ForbiddenErrorDto,
  NotFoundErrorDto,
  InternalServerErrorDto,
} from '../dto';

export type ApiCommonResponseOptions = ApiResponseOptions & {
  excludeStatuses?: number[];
};

export function ApiCommonResponse<TModel extends Type<any>>(
  model?: TModel,
  options?: ApiCommonResponseOptions,
) {
  const excludeStatuses = options?.excludeStatuses || [];
  const decorators = [];

  if (model) {
    decorators.push(
      ApiExtraModels(model),
      ApiResponse({
        ...options,
        schema: {
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: getSchemaPath(model) },
            timestamp: { type: 'string', format: 'date-time' }
          },
        },
      }),
    );
  }

  // Add common error responses unless explicitly excluded
  if (!excludeStatuses.includes(400)) {
    decorators.push(
      ApiBadRequestResponse({
        description: 'Validation failed',
        type: ValidationErrorDto,
      })
    );
  }

  if (!excludeStatuses.includes(401)) {
    decorators.push(
      ApiUnauthorizedResponse({
        description: 'Unauthorized',
        type: UnauthorizedErrorDto,
      })
    );
  }

  if (!excludeStatuses.includes(403)) {
    decorators.push(
      ApiForbiddenResponse({
        description: 'Forbidden',
        type: ForbiddenErrorDto,
      })
    );
  }

  if (!excludeStatuses.includes(404)) {
    decorators.push(
      ApiNotFoundResponse({
        description: 'Not Found',
        type: NotFoundErrorDto,
      })
    );
  }

  decorators.push(
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: InternalServerErrorDto,
    })
  );

  return applyDecorators(...decorators);
}
