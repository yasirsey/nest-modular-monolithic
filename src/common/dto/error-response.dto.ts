// src/common/dto/error-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    example: {
      statusCode: 400,
      message: 'Error message',
      timestamp: '2024-02-01T12:00:00.000Z',
      path: '/api/endpoint'
    }
  })
  error: {
    statusCode: number;
    message: string | string[];
    timestamp: string;
    path: string;
  };
}
