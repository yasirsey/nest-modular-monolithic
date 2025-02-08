// src/modules/auth/dto/response/session.response.dto.ts
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from '../../../users/dto/response/user.dto';
import { Permission } from '../../schemas/permission.schema';

export class SessionResponseDto extends OmitType(UserDto, [
  'refreshToken',
] as const) {
  @ApiProperty({ type: [Permission], example: ['users.read', 'users.write'] })
  permissions: Permission[];

  @ApiProperty({ example: '2024-02-01T12:00:00.000Z' })
  lastLoginAt: Date;
}
