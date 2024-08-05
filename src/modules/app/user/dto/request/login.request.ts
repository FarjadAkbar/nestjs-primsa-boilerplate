import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export default class LoginRequestDTO {
    @ApiProperty({ description: 'Email' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password' })
    @Length(1, 255)
    password: string;

    @ApiPropertyOptional({ description: 'remember me for long term authentication. just required true or false.' })
    @IsOptional()
    @IsBoolean()
    rememberToken: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(1, 255)
    fcmToken: string;
}
