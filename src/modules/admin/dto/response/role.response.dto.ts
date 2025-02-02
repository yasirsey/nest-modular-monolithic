import { ApiProperty } from "@nestjs/swagger";

// src/modules/admin/dto/response/role.response.dto.ts
export class RoleResponseDto {
    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    id: string;
  
    @ApiProperty({ example: 'user-manager' })
    name: string;
  
    @ApiProperty({ 
      type: [String],
      example: ['users.create', 'users.read', 'users.update']
    })
    permissions: string[];
  
    @ApiProperty({ 
      example: 'Can manage user accounts',
      required: false
    })
    description?: string;
  
    @ApiProperty({ example: '2024-02-01T12:00:00.000Z' })
    createdAt: Date;
  
    @ApiProperty({ example: '2024-02-01T12:00:00.000Z' })
    updatedAt: Date;
  }
  