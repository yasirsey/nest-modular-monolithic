// src/modules/auth/dto/response/logout.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success: boolean;
}