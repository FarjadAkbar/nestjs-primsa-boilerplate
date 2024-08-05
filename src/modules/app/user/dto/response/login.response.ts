import { ApiProperty } from '@nestjs/swagger';
import { UserResponseModel } from './model';

export default class LoginResponseDTO {
    @ApiProperty({ description: 'Token' })
    token: string;

    @ApiProperty({ description: 'user object' })
    user: UserResponseModel
}
