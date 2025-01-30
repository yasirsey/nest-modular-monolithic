// src/modules/admin/dto/create-admin.dto.ts
import { IsEmail, IsString, IsArray, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  roles: string[];
}
