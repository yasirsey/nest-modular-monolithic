import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/modules/auth/schemas/permission.schema';

// Önce phone için ayrı bir DTO oluşturalım
export class PhoneDto {
  @ApiProperty({ example: '+90', description: 'Country code with plus sign' })
  countryCode: string;

  @ApiProperty({
    example: '5321234567',
    description: 'Phone number without country code',
  })
  number: string;
}

export class UserDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  lastName?: string;

  @ApiProperty({ example: ['user'] })
  roles: string[];

  @ApiProperty({ type: [Permission], example: ['read:users'] })
  permissions?: Permission[];

  @ApiProperty({ example: true })
  isEmailVerified: boolean;

  @ApiProperty({ type: PhoneDto, required: false })
  phone?: PhoneDto;

  @ApiProperty({ example: '2024-02-01T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-01T12:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 'local' })
  provider?: string;

  @ApiProperty({ example: '2024-02-01T12:00:00.000Z' })
  lastLoginAt?: Date;

  @ApiProperty()
  refreshToken?: string;
}
