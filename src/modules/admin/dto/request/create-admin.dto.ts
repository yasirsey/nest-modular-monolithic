// src/modules/admin/dto/request/create-admin.dto.ts
import { IsEmail, IsString, IsArray, MinLength, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the admin'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongP@ss123',
    description: 'Password for the admin account (minimum 6 characters)'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    type: [String],
    example: ['admin', 'user-manager'],
    description: 'List of role IDs to assign to the admin'
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles: string[];
}
