import { Injectable } from '@nestjs/common';
import { Prisma, RideUserType, TokenReason, User, UserOAuthType, UserStatus, UserType } from '@prisma/client';
import { EmailTemplates } from '../../../constants';
import DatabaseService from 'database/database.service';
import { BadRequestException, FatalErrorException, NotFoundException } from 'core/exceptions/response.exception';
import { MessageResponseDTO } from 'core/response/response.schema';
import {
    ComparePassword,
    decryptBase64RSA,
    ExcludeFields,
    GenerateUUID,
    GenerateVerificationCode,
    GetOrderOptions,
    GetPaginationOptions,
    HashPassword,
} from 'helpers/util.helper';
import AuthService from 'modules/app/auth/auth.service';
import TokenService from 'modules/app/token/token.service';
import FindUsersRequestDTO from './dto/request/find.request';
import { EmailVerificationRequestDTO, ForgetPasswordRequestDTO, ForgetPasswordVerificationRequestDTO, SendEmailVerificationRequestDTO } from './dto/request/forget_password.request';
import LoginRequestDTO from './dto/request/login.request';
import ResetPasswordRequestDTO, { ResendPasswordRequestDTO } from './dto/request/reset_password.request';
import { SignupRequestDTO, UpdateUserRequestDTO } from './dto/request/signup.request';
import FindUsersResponseDTO from './dto/response/find.response';
import {
    ForgetPasswordResponseDTO,
    ForgetPasswordVerificationResponseDTO,
    ResendOTPResponseDTO,
} from './dto/response/forget_password.response';
import LoginResponseDTO from './dto/response/login.response';
import SignupResponseDTO from './dto/response/signup.response';
import GetMeResponseDTO from './dto/response/me.response';
import GetUserByIdResponseDTO from './dto/response/getById.response';
import OAuthLoginRequestDTO from './dto/request/oauth_login.request';
import { OAuthProviders } from 'core/interfaces';
import { ForgetPasswordPayload } from 'modules/email/types';
import LoginWithTouchIdRequestDTO from './dto/request/login_touchid.request';

@Injectable()
export default class UserService {
    constructor(
        private _dbService: DatabaseService,
        private _authService: AuthService,
        private _tokenService: TokenService
    ) {}

    async Login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
        const user = await this._dbService.user.findFirst({
            where: { email: data.email.toLowerCase() },
            include: {
                settings: true,
                profilePicture: true,
            },
        });
        if (!user || !user.password) {
            throw new BadRequestException('auth.invalid_credentials');
        }

        const isPasswordMatched = await ComparePassword(data.password, user.password);
        if (!isPasswordMatched) {
            throw new BadRequestException('auth.invalid_credentials');
        }

        const token = await this._authService.CreateSession(user.id);

        if (data.rememberToken && data.rememberToken === true) {
            await this._authService.RememberMeTime(token);
        }

        return { token, user: ExcludeFields(user, ['password']) };
    }

    async OAuthLogin(data: OAuthLoginRequestDTO): Promise<LoginResponseDTO> {
        const oauthResult = await this._oauthService.GetTokenData(
            data.token,
            data.type.toLowerCase() as OAuthProviders,
        );
        if (!oauthResult) {
            throw new BadRequestException('oauth.invalid_token');
        }

        const oauth = await this._dbService.userOAuth.findFirst({
            where: { providerId: oauthResult.id, type: data.type },
            select: { id: true, imageUrl: true, user: { select: { id: true } } },
        });

        if (!oauth || !oauth.user.id) {
            throw new NotFoundException('user.not_found');
        }

        if (oauthResult.imageUrl && !oauth.imageUrl) {
            await this._dbService.userOAuth.update({
                where: { userId: oauth.user.id },
                data: { imageUrl: oauthResult.imageUrl },
            });
        }

        const user = await this._dbService.user.findFirst({ where: { id: oauth.user.id } });

        const token = await this._authService.CreateSession(user.id);

        return { token, user: ExcludeFields(user, ['password']) };
    }

    async Signup(data: SignupRequestDTO): Promise<SignupResponseDTO> {
        const isOAuthLogin = data.token && data.providerType;
        let name = data?.name;
        let email = data?.email?.toLowerCase();
        let password = data?.password ?? 'click123';
        let providerId = null;
        let providerType = null;
        let imageUrl: string;

        if (isOAuthLogin) {
            const providerMappings: Record<UserOAuthType, OAuthProviders> = {
                [UserOAuthType.GOOGLE]: 'google',
                [UserOAuthType.APPLE]: 'apple',
                [UserOAuthType.FACEBOOK]: 'facebook',
            };

            const oauthResult = await this._oauthService.GetTokenData(data.token, providerMappings[data.providerType]);
            if (!oauthResult) {
                throw new BadRequestException('oauth.invalid_token');
            }

            name = oauthResult.name;
            email = oauthResult.email?.toLowerCase();
            providerId = oauthResult.id;
            providerType = oauthResult.type;
            imageUrl = oauthResult.imageUrl;
        }

        const existingUser = await this._dbService.user.findFirst({
            where: { email },
            select: { id: true },
        });
        if (existingUser) {
            if(isOAuthLogin) {
                return await this.OAuthLogin({
                    token: data.token,
                    type: data.providerType
                });
            }
            throw new BadRequestException('auth.email_already_exist');
        }

        const user = await this._dbService.user.create({
            data: {
                name,
                email,
                password: await HashPassword(password),
                ...(data.phone && { phone: data.phone }),
                ...(data.countryCode && { countryCode: data.countryCode }),
                type: UserType.USER,
                status: isOAuthLogin ? UserStatus.ACTIVE : UserStatus.PENDING,
                settings: {
                    create: {},
                },
                ...(isOAuthLogin && {
                    oauth: {
                        create: {
                            providerId,
                            type: providerType.toUpperCase() as UserOAuthType,
                            ...(imageUrl && { imageUrl }),
                        },
                    },
                }),
            },
            include: {
                settings: true,
                profilePicture: true,
            },
        });

        if(!isOAuthLogin) await this.SendVerifyEmail({email});
        const token = await this._authService.CreateSession(user.id);
        return { token, user: ExcludeFields(user, ['password']) };
    }

    async UpdateUser(data: UpdateUserRequestDTO)
    :Promise<GetMeResponseDTO> {
        let name = data?.name;
        let email = data?.email?.toLowerCase();
        let profilePictureId = data.profilePictureId
        const existingUser = await this._dbService.user.findFirst({
            where: { id:data.id },
            select: { id: true },
        });
        if (!existingUser) {
            throw new BadRequestException('User does not exists');
        }
        await this._dbService.user.updateMany({
            where:{
                id:data.id
            },
            data: {
                
                name,
                email,
                ...(data.phone && { phone: data.phone }),
                ...(data.countryCode && { countryCode: data.countryCode }),
                profilePictureId
            }
        });
        
        const user = await this._dbService.user.findUnique({
            where: { id: data.id },
            include: {
                settings: true,
                profilePicture: { select: { id: true, path: true, thumbPath: true } },
            },
        });
    
        return ExcludeFields(user, ['password']);
    }

    async SendVerifyEmail(data: SendEmailVerificationRequestDTO): Promise<boolean> {
        const user = await this._dbService.user.findFirst({
            where: { email: data.email.toLowerCase() },
        });
        if (!user) {
            throw new BadRequestException('user.not_found');
        }
        if (user.status !== UserStatus.PENDING) {
            throw new BadRequestException('user can not be processed because the user is already verified or is on hold.');
        }

        const otp = GenerateVerificationCode();

        const token = await this._tokenService.CreatePasswordToken({
            uuid: GenerateUUID(),
            code: otp,
            userId: user.id,
            reason: TokenReason.VERIFICATION,
        });

        const emailPayload: SQSSendEmailArgs<ForgetPasswordPayload> = {
            template: EmailTemplates.VERIFY_EMAIL,
            subject: 'Verify Email',
            email: user.email,
            data: {
                name: user.name,
                code: otp,
            },
        };
        await this._queueService.EnqueueEmail(emailPayload);

        return true;
    }
    
    async EmailVerification(
        data: EmailVerificationRequestDTO,
    ): Promise<boolean> {
        const token = await this._dbService.token.findFirst({
            where:{userId:data.userId,code:data.code,reason:TokenReason.VERIFICATION},
            orderBy:{createdAt:'desc'}
        });
        if (!token) {
            throw new BadRequestException('auth.invalid_token');
        }

        await this._dbService.user.updateMany({
            where: {
                id: data.userId,
            },
            data: {
                status:UserStatus.ACTIVE
            },
        })
        await this._tokenService.Delete(token.id);
        return true;
    }

    async ForgetPassword(data: ForgetPasswordRequestDTO): Promise<ForgetPasswordResponseDTO> {
        const user = await this._dbService.user.findFirst({
            where: { email: data.email.toLowerCase() },
        });
        if (!user) {
            throw new BadRequestException('user.not_found');
        }

        const otp = GenerateVerificationCode();

        const token = await this._tokenService.CreatePasswordToken({
            uuid: GenerateUUID(),
            code: otp,
            userId: user.id,
            reason: TokenReason.FORGOT_PASSWORD,
        });

        const emailPayload: SQSSendEmailArgs<ForgetPasswordPayload> = {
            template: EmailTemplates.FORGET_PASSWORD,
            subject: 'Forget Password',
            email: user.email,
            data: {
                name: user.name,
                code: otp,
            },
        };
        await this._queueService.EnqueueEmail(emailPayload);

        return { token };
    }

    async ForgetPasswordVerification(
        data: ForgetPasswordVerificationRequestDTO,
    ): Promise<ForgetPasswordVerificationResponseDTO> {
        const token = await this._tokenService.VerifyCode(data.token, data.code, TokenReason.FORGOT_PASSWORD);
        if (!token) {
            throw new BadRequestException('auth.invalid_token');
        }

        const resetToken = await this._tokenService.CreatePasswordToken({
            uuid: GenerateUUID(),
            userId: token.userId,
            reason: TokenReason.RESET_PASSWORD,
        });
        await this._tokenService.Delete(token.id);

        return { token: resetToken };
    }

    async ResetPassword(data: ResetPasswordRequestDTO): Promise<MessageResponseDTO> {
        const token = await this._tokenService.GetToken(data.token, TokenReason.RESET_PASSWORD);
        if (!token) {
            throw new BadRequestException('auth.invalid_token');
        }

        const encryptedPassword = await HashPassword(data.password);
        await this._dbService.user.update({
            where: { id: token.userId },
            data: { password: encryptedPassword },
        });

        await this._tokenService.Delete(token.id);

        return { message: 'common.success' };
    }

    async ResendOTP(data: ResendPasswordRequestDTO): Promise<ResendOTPResponseDTO> {
        const user = await this._dbService.user.findFirst({
            where: { email: data.email.toLowerCase() },
        });
        if (!user) {
            throw new BadRequestException('user.not_found');
        }

        const token = await this._tokenService.GetToken(data.token, TokenReason.FORGOT_PASSWORD);
        if (!token) {
            throw new BadRequestException('auth.invalid_token');
        }
        await this._tokenService.Delete(token.id);

        const otp = GenerateVerificationCode();

        const refreshToken = await this._tokenService.CreatePasswordToken({
            uuid: GenerateUUID(),
            code: otp,
            userId: user.id,
            reason: TokenReason.FORGOT_PASSWORD,
        });

        const emailPayload: SQSSendEmailArgs<ForgetPasswordPayload> = {
            template: EmailTemplates.FORGET_PASSWORD,
            subject: 'Forget Password',
            email: user.email,
            data: {
                name: user.name,
                code: otp,
            },
        };
        await this._queueService.EnqueueEmail(emailPayload);

        return { token: refreshToken };
    }

    async GetMe(user: User, headers: { authorization: string }): Promise<GetMeResponseDTO> {
        const currentUser = await this._dbService.user.findUnique({
            where: { id: user.id },
            include: {
                settings: true,
                profilePicture: { select: { id: true, path: true, thumbPath: true } },
            },
        });
        await this._authService.RefreshTokenTime(headers.authorization);
        return ExcludeFields(currentUser, ['password']);
    }

    async Find(data: FindUsersRequestDTO): Promise<FindUsersResponseDTO> {
        const where: Prisma.UserWhereInput = {
            ...(!!data.type && { type: data.type }),
        };
        const pagination = GetPaginationOptions(data);
        const order = GetOrderOptions(data);

        const users = await this._dbService.user.findMany({
            include: {
                profilePicture: true,
            },
            where,
            ...pagination,
            orderBy: order,
        });

        const count = await this._dbService.user.count({
            where,
        });

        return { data: users, count };
    }

    async Get(id: number, currentUser: User): Promise<GetUserByIdResponseDTO> {
        const basicUser = await this._dbService.user.findFirst({
            where: { id },
            select: { id: true },
        });
        if (!basicUser) {
            throw new NotFoundException('user.not_found');
        }

        const user = await this._dbService.user.findFirst({
            where: { id },
            include: {
                profilePicture: { select: { id: true, path: true, thumbPath: true } },
            },
        });

        return user;
    }

    async Logout(token: string) {
        const [loggedOut] = await Promise.all([
            this._authService.DestroySession(token),
            this._dbService.device.updateMany({
                where: {
                    authToken: token,
                },
                data: {
                    fcmToken: null,
                },
            }),
        ]);

        await this._dbService.device.deleteMany({
            where: {
                authToken: token,
            },
        });

        if (!loggedOut) {
            throw new FatalErrorException();
        }

        return {
            message: 'common.success',
        };
    }

    async Delete(userId: number) {
        const user = await this._dbService.user.findFirst({
            where: {
                id: userId,
            },
            include: {
                vendor: {
                    include: {
                        stores: {
                            include: {
                                products: {
                                    include: {
                                        productImages: true,
                                        productVariants: true,
                                        orderItems: true,
                                        inventory: true,
                                        cartProducts: true,
                                    },
                                },
                            },
                        },
                    },
                },
                riderRideRequests: { include: { ride: true } },
                devices: true,
                driverVehicles: true,
                userLocations: true,
                userSignContracts: true,
                userSubscriptions: true,
                userTransactions: true,
                driverRides: true,
                role: true,
                medias: true,
                profilePicture: true,
                tokens: true,
            },
        });

        if (!user) {
            throw new NotFoundException('user.not_found');
        }

        let deletePromises: any = [];

        if (user.vendor && user.vendor.stores) {
            for (let store of user.vendor.stores) {
                if (store.products) {
                    for (let product of store.products) {
                        if (product.cartProducts) {
                            let cart = await this._dbService.cartProduct.findFirst({
                                where: { productId: product.id },
                            });
                            deletePromises.push(
                                this._dbService.cartProduct.deleteMany({ where: { productId: cart.productId } }),
                                this._dbService.cart.delete({ where: { id: cart.id } }),
                            );
                        }
                        if (product.orderItems) {
                            let order = await this._dbService.orderItems.findFirst({
                                where: { productId: product.id },
                            });
                            deletePromises.push(
                                this._dbService.orderItems.deleteMany({ where: { orderId: order.id } }),
                                this._dbService.order.delete({ where: { id: order.id } }),
                            );
                        }
                        if (product.productImages) {
                            deletePromises.push(
                                this._dbService.productImage.deleteMany({ where: { productId: product.id } }),
                            );
                        }
                        if (product.productVariants) {
                            deletePromises.push(
                                this._dbService.productVariant.deleteMany({ where: { productId: product.id } }),
                            );
                        }
                        deletePromises.push(this._dbService.inventory.delete({ where: { productId: product.id } }));
                    }
                    deletePromises.push(this._dbService.product.deleteMany({ where: { storeId: store.id } }));
                }
            }
            deletePromises.push(this._dbService.store.deleteMany({ where: { vendorId: user.vendor.id } }));
            deletePromises.push(this._dbService.vendor.delete({ where: { userId: user.id } }));
        }

        if (user.riderRideRequests && user.rideUserType === RideUserType.RIDER) {
            if (user.riderRideRequests) {
                for (let rideRequest of user.riderRideRequests) {
                    deletePromises.push(this._dbService.ride.deleteMany({ where: { rideRequestId: rideRequest.id } }));
                }
            }
            deletePromises.push(this._dbService.rideRequest.deleteMany({ where: { riderId: userId } }));
        }

        if (user.driverVehicles) {
            deletePromises.push(this._dbService.driverVehicle.deleteMany({ where: { userId: user.id } }));
        }

        if (user.userLocations) {
            deletePromises.push(this._dbService.userLocation.deleteMany({ where: { userId: user.id } }));
        }

        if (user.driverRides) {
            deletePromises.push(this._dbService.ride.deleteMany({ where: { driverId: user.id } }));
        }

        if (user.role) {
            deletePromises.push(this._dbService.userRole.delete({ where: { userId: user.id } }));
        }

        if (user.devices) {
            deletePromises.push(this._dbService.device.deleteMany({ where: { userId: user.id } }));
        }

        if (user.tokens) {
            deletePromises.push(this._dbService.token.deleteMany({ where: { userId: user.id } }));
        }

        if (user.profilePicture) {
            deletePromises.push(this._dbService.media.delete({ where: { id: user.profilePictureId } }));
        }

        if (user.medias) {
            deletePromises.push(this._dbService.media.deleteMany({ where: { userId: user.id } }));
        }

        
        await Promise.all(deletePromises);
        await this._dbService.user.updateMany({
            where:{id:user.id},
            data:{
                email:`delete_user_${user.id}@deleted.com`,
                name:"Deleted User",
                phone:null,
                countryCode: null,
                deletedAt: new Date()
            }
        })
        
        return {
            message: 'common.success',
        };
    }

    async LoginWithTouch(inp: LoginWithTouchIdRequestDTO) {
        const user = await this._dbService.user.findFirst({
            where: { id: Number(inp.userId) },
            include: {
                settings: true,
                profilePicture: true
            },
        });

        if (!user) {
            throw new NotFoundException('user.not_found');
        }

        if (!user.settings.touchIdEnabled) {
            throw new BadRequestException('user.setting.touchId.not_enabled');
        }

        if (!user.settings.publicKey) {
            throw new BadRequestException('user.publickey.not_found');
        }

        const isVerified = decryptBase64RSA(user.settings.publicKey, inp.signature, { userId: user.id.toString() });

        if (!isVerified) {
            throw new BadRequestException('auth.invalid_credentials');
        }
        const token = await this._authService.CreateSession(user.id);

        return { token, user: ExcludeFields(user, ['password']) };
    }

}
