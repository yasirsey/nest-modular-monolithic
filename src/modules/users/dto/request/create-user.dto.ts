// src/modules/users/dto/request/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email address of the user'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'StrongPass123!',
        description: 'Password for the user account'
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'John',
        description: 'First name of the user',
        required: false
    })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the user',
        required: false
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
        default: false
    })
    @IsBoolean()
    @IsOptional()
    isEmailVerified?: boolean;
}
