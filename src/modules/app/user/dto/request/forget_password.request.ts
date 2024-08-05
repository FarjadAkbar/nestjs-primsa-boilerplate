import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, IsUUID } from 'class-validator';

export class SendEmailVerificationRequestDTO {
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class EmailVerificationRequestDTO {
    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsString()
    code: string;
}

export class ForgetPasswordRequestDTO {
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class ForgetPasswordVerificationRequestDTO {
    @ApiProperty()
    @IsUUID('4')
    token: string;

    @ApiProperty()
    @IsString()
    code: string;
}
