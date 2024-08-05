import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class UpdateFCMTokenDTO {
    @ApiProperty()
    @IsString()
    fcmToken: string;
}
