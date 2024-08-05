import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID, Length } from 'class-validator';

export default class ResetPasswordRequestDTO {
    @ApiProperty()
    @IsUUID('4')
    token: string;

    @ApiProperty()
    @Length(1, 255)
    password: string;
}
export class ResendPasswordRequestDTO {
    @ApiProperty()
    @IsUUID('4')
    token: string;

    @ApiProperty()
    @IsEmail()
    email: string;
}