// src/modules/auth/dto/response/auth.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dto/response/user.dto';

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
