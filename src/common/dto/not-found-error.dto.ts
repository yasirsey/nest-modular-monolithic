// src/common/dto/not-found-error.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class NotFoundErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: {
      statusCode: 404,
      message: 'Resource not found',
      timestamp: '2024-02-01T12:00:00.000Z',
      path: '/api/endpoint'
    }
  })
  error: {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
  };
}
