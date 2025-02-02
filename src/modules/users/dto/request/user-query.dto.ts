// src/modules/users/dto/request/user-query.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UserQueryDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    minimum: 1,
    default: 1,
    required: false
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    minimum: 1,
    default: 10,
    required: false
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: 'Search term for filtering users',
    required: false,
    example: 'john'
  })
  @IsString()
  @IsOptional()
  search?: string;
}
