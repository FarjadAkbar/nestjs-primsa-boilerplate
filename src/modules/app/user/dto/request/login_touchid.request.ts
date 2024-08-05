import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
export default class LoginWithTouchIdRequestDTO {
    @ApiProperty({ description: 'Id of user' })
    @IsInt()
    userId: number;

    @ApiProperty({ description: 'encrypted signature' })
    @IsString()
    signature: string;
}