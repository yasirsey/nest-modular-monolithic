// src/common/decorators/api-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseType = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiExtraModels(model),
        ApiOkResponse({
            schema: {
                properties: {
                    success: { type: 'boolean' },
                    data: { $ref: getSchemaPath(model) },
                    timestamp: { type: 'string' }
                }
            }
        })
    );
};
