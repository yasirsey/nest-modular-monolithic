// src/common/dto/internal-server-error.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponseDto } from './error-response.dto';

export class InternalServerErrorDto extends ErrorResponseDto {
  @ApiProperty({
    example: {
      statusCode: 500,
      message: 'Internal server error',
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
