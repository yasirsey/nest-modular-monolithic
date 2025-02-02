// src/common/dto/validation-error.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class ValidationErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: {
      statusCode: 400,
      message: ['email must be an email', 'password must be longer than 6 characters'],
      error: 'Bad Request',
      timestamp: '2024-02-01T12:00:00.000Z',
      path: '/api/endpoint'
    }
  })
  error: {
    statusCode: number;
    message: string[];
    error: string;
    timestamp: string;
    path: string;
  };
}
