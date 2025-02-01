// src/modules/auth/dto/response/session.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dto/response/user.dto';

export class SessionResponseDto extends UserDto {
  @ApiProperty({ type: [String] })
  permissions?: string[];

  @ApiProperty()
  lastLoginAt?: Date;
}
