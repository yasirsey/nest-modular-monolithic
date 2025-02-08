// src/modules/users/dto/request/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { PhoneDto } from '../response/user.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Password for the user account',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    required: false,
    type: PhoneDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneDto)
  phone?: PhoneDto;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'local' })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({ example: 'google123' })
  @IsString()
  @IsOptional()
  providerId?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the user email is verified',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;
}
