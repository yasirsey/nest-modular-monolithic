// src/modules/admin/dto/request/create-permission.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'users.create',
    description: 'Name of the permission'
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Allows creating new users',
    description: 'Description of what the permission allows',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
}
