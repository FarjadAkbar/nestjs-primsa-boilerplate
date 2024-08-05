import { Body, Req } from '@nestjs/common';
import { ApiController, Authorized, Get, Post, Put } from 'core/decorators';
import { MessageResponseDTO } from 'core/response/response.schema';
import DeviceService from './device.service';
import CreateDeviceRequestDTO from './dto/request/create.request';
import UpdateFCMTokenDTO from './dto/request/update_fcm_token.request';
import CreateDeviceResponseDTO from './dto/response/create.response';

@ApiController({
    path: '/device',
    tag: 'device',
    version: '1',
})
export default class DeviceController {
    constructor(private _deviceService: DeviceService) {}

    @Post({
        path: '/',
        description: 'Create a new device',
        response: CreateDeviceResponseDTO,
    })
    Create(@Body() data: CreateDeviceRequestDTO): Promise<CreateDeviceResponseDTO> {
        return this._deviceService.Create(data);
    }

    @Authorized()
    @Put({
        path: '/update-fcm-token/',
        description: 'Update fcm token',
        response: MessageResponseDTO,
    })
    UpdateFCMToken(
        @Body() data: UpdateFCMTokenDTO,
        @Req() req: any,
    ): Promise<MessageResponseDTO> {
        return this._deviceService.UpdateFCMToken(req.headers['authorization'], data.fcmToken);
    }
}
