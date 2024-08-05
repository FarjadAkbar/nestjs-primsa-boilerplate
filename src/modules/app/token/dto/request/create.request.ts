import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TokenReason } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export default class CreatePasswordTokenRequestDTO {
    @ApiProperty({ enum: TokenReason })
    @IsEnum(TokenReason)
    reason: TokenReason;

    @ApiProperty()
    @IsUUID('4')
    uuid: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;

    @ApiProperty()
    @IsInt()
    userId: number;
}
