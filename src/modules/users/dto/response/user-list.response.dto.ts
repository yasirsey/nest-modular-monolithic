// src/modules/users/dto/response/user-list.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class UserListResponseDto {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
