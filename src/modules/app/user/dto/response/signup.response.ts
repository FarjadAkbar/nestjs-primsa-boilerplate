import { ApiProperty } from '@nestjs/swagger';
import { UserResponseModel } from './model';

export default class SignupResponseDTO {
    @ApiProperty({ description: 'Token' })
    token: string;

    @ApiProperty({ description: 'user object' })
    user: UserResponseModel
}
