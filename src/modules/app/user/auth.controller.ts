import { Body, Req } from '@nestjs/common';
import { ApiController, Authorized, Post } from 'core/decorators';
import { BooleanResponseDTO, MessageResponseDTO } from 'core/response/response.schema';
import {
    EmailVerificationRequestDTO,
    ForgetPasswordRequestDTO,
    ForgetPasswordVerificationRequestDTO,
    SendEmailVerificationRequestDTO,
} from './dto/request/forget_password.request';
import LoginRequestDTO from './dto/request/login.request';
import LoginWithTouchIdRequestDTO from './dto/request/login_touchid.request';
import OAuthLoginRequestDTO from './dto/request/oauth_login.request';
import ResetPasswordRequestDTO, { ResendPasswordRequestDTO } from './dto/request/reset_password.request';
import { SignupRequestDTO } from './dto/request/signup.request';
import {
    ForgetPasswordResponseDTO,
    ForgetPasswordVerificationResponseDTO,
    ResendOTPResponseDTO,
} from './dto/response/forget_password.response';
import LoginResponseDTO from './dto/response/login.response';
import SignupResponseDTO from './dto/response/signup.response';
import UserService from './user.service';
import { AppResponse, ResponseHelper } from './dto/response/app.response';

@ApiController({ version: '1', tag: 'auth', path: '/auth' })
export default class AuthController {
    constructor(private _userService: UserService) {}

    @Post({
        path: '/login/oauth',
        description: 'Login with OAuth apps',
        response: LoginResponseDTO,
    })
    OAuthLogin(@Body() data: OAuthLoginRequestDTO): Promise<LoginResponseDTO> {
        return this._userService.OAuthLogin(data);
    }

    @Post({
        path: '/login',
        description: 'Login to the application',
        response: LoginResponseDTO,
    })
    Login(@Body() data: LoginRequestDTO): Promise<LoginResponseDTO> {
        return this._userService.Login(data);
    }

    @Authorized()
    @Post({
        path: '/logout',
        description: 'Logout of the application',
        response: MessageResponseDTO,
    })
    Logout(@Req() req: any): Promise<MessageResponseDTO> {
        return this._userService.Logout(req.headers['authorization']);
    }

    @Post({
        path: '/signup',
        description: 'Signup in the application',
        response: SignupResponseDTO,
    })
    Signup(@Body() data: SignupRequestDTO): Promise<SignupResponseDTO> {
        return this._userService.Signup(data);
    }

    @Post({
        path: '/send-email-verification',
        description: 'Sends email verification code',
        response: AppResponse<boolean>,
    })
    SendEmailVerification(@Body() data: SendEmailVerificationRequestDTO): Promise<AppResponse<boolean>> {
        return this._userService.SendVerifyEmail(data).then(d => ResponseHelper.ok(d));
    }

    @Post({
        path: '/verify-email',
        description: 'Verifys the email by otp',
        response: AppResponse<boolean>,
    })
    EmailVerification(
        @Body() data: EmailVerificationRequestDTO,
    ): Promise<AppResponse<boolean>> {
        return this._userService.EmailVerification(data).then(d => ResponseHelper.ok(d));
    }
    
    @Post({
        path: '/forget-password',
        description: 'Forget password initiate',
        response: ForgetPasswordResponseDTO,
    })
    ForgetPassword(@Body() data: ForgetPasswordRequestDTO): Promise<ForgetPasswordResponseDTO> {
        return this._userService.ForgetPassword(data);
    }

    @Post({
        path: '/forget-password/verification',
        description: 'Forget password verification',
        response: ForgetPasswordVerificationResponseDTO,
    })
    ForgetPasswordVerification(
        @Body() data: ForgetPasswordVerificationRequestDTO,
    ): Promise<ForgetPasswordVerificationResponseDTO> {
        return this._userService.ForgetPasswordVerification(data);
    }

    @Post({
        path: '/reset-password',
        description: 'Forget password initiate',
        response: BooleanResponseDTO,
    })
    ResetPassword(@Body() data: ResetPasswordRequestDTO): Promise<MessageResponseDTO> {
        return this._userService.ResetPassword(data);
    }

    @Post({
        path: '/resend-otp',
        description: 'Resend OTP',
        response: ForgetPasswordResponseDTO,
    })
    ResendOTP(@Body() data: ResendPasswordRequestDTO): Promise<ResendOTPResponseDTO> {
        return this._userService.ResendOTP(data);
    }

    @Post({
        path: '/login/touch-id',
        description: 'Login using touch id.',
        response: LoginResponseDTO,
    })
    LoginWithTouch(@Body() data: LoginWithTouchIdRequestDTO): Promise<LoginResponseDTO> {
        return this._userService.LoginWithTouch(data);
    }
}
