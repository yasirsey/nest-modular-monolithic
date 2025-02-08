// src/modules/auth/dto/request/update-profile.request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Phone için ayrı bir DTO oluşturalım
export class PhoneDto {
  @ApiProperty({
    description: 'Country code with plus sign',
    example: '+90',
    required: true,
  })
  @IsString()
  countryCode: string;

  @ApiProperty({
    description: 'Phone number without country code',
    example: '5321234567',
    required: true,
  })
  @IsString()
  number: string;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the user',
    required: false,
    type: PhoneDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneDto)
  phone?: PhoneDto;
}
