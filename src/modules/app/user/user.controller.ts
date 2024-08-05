import { Body, Headers, Param, ParseIntPipe } from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import { ApiController, Authorized, CurrentUser, Delete, Get, Post, Put } from 'core/decorators';
import { MessageResponseDTO } from 'core/response/response.schema';
import GetMeResponseDTO from './dto/response/me.response';
import UserService from './user.service';
import { UpdateUserRequestDTO } from './dto/request/signup.request';
import { ResponseHelper } from './dto/response/app.response';
import { AppResponse } from './dto/response/app.response';
import { ApiResponse } from '@nestjs/swagger';

@ApiController({ version: '1', tag: 'user', path: 'user' })
export default class UserController {
    constructor(private _userService: UserService) {}

    @Authorized()
    @Get({
        path: '/me',
        description: 'Get current user details and refresh the token time',
        response: GetMeResponseDTO,
    })
    GetMe(@CurrentUser() user: User, @Headers() headers:any): Promise<GetMeResponseDTO> {
        return this._userService.GetMe(user,headers);
    }
    
    @Authorized()
    @Put({
        path: '/update-user',
        description: 'updates the user by the provided user id',
        response: GetMeResponseDTO,
    })
    UpdateUser(@Body() data: UpdateUserRequestDTO): Promise<GetMeResponseDTO> {
        return this._userService.UpdateUser(data);
    }


    @Authorized(UserType.USER)
    @Delete({
        path: '/delete-account',
        description: 'Delete account of the user logged in, self delete account',
        response: MessageResponseDTO,
    })
    DeleteAccount(@CurrentUser() user: User): Promise<MessageResponseDTO> {
        return this._userService.Delete(user.id);
    }
}
