// src/modules/admin/dto/request/create-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, ArrayNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'user-manager',
    description: 'Name of the role'
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: [String],
    example: ['users.create', 'users.read', 'users.update'],
    description: 'List of permission IDs to assign to the role'
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({
    example: 'Can manage user accounts',
    description: 'Description of the role',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
}
