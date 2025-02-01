import { ApiProperty } from "@nestjs/swagger";

// src/modules/users/dto/response/user.dto.ts
export class UserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName?: string;

    @ApiProperty()
    lastName?: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ type: [String] })
    roles: string[];

    @ApiProperty()
    isEmailVerified: boolean;
}
