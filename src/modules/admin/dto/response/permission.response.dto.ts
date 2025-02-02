import { ApiProperty } from "@nestjs/swagger";

// src/modules/admin/dto/response/permission.response.dto.ts
export class PermissionResponseDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    id: string;
  
    @ApiProperty({ example: 'users.create' })
    name: string;
  
    @ApiProperty({ 
      example: 'Allows creating new users',
      required: false
    })
    description?: string;
  
    @ApiProperty({ example: '2024-02-01T12:00:00.000Z' })
    createdAt: Date;
  
    @ApiProperty({ example: '2024-02-01T12:00:00.000Z' })
    updatedAt: Date;
  }
  