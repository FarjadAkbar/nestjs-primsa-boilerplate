import { ApiProperty } from '@nestjs/swagger';
import { UserOAuthType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export default class OAuthLoginRequestDTO {
    @ApiProperty({description: 'Either access_token or id_token. But you should send id_token if present else you can send access_token(incase of facebook) as well.'})
    @IsString()
    token: string;

    @ApiProperty({ enum: UserOAuthType })
    @IsEnum(UserOAuthType)
    type: UserOAuthType;
}
