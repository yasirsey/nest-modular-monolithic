// src/common/dto/conflict-error.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class ConflictErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: {
      statusCode: 409,
      message: 'Resource already exists',
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
