import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserOAuthType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDate,
    IsDateString,
    IsEmail,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches,
    ValidateIf,
} from 'class-validator';

export class SignupRequestDTO {
    @ApiPropertyOptional()
    @ValidateIf(obj => obj.token === undefined && obj.providerType === undefined)
    @IsString()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.token === undefined && obj.providerType === undefined)
    @IsString()
    @Length(6, 128)
    password: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.token === undefined && obj.providerType === undefined)
    @IsString()
    @Length(1, 255)
    name: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.phone !== undefined)
    @IsString()
    // @IsPhoneNumber('AE')
    // @Matches(/^\+?[1-9][0-9]{7,14}$/, {
    //     message: 'Invalid phone number.',
    // })
    phone: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.token === undefined && obj.providerType === undefined && obj.phone !== undefined)
    @IsString()
    countryCode: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.password === undefined)
    @IsString()
    token?: string;

    @ApiPropertyOptional({ enum: UserOAuthType, description: 'Either access_token or id_token. But you should send id_token if present else you can send access_token(incase of facebook) as well.' })
    @ValidateIf(obj => obj.password === undefined)
    @IsEnum(UserOAuthType)
    providerType?: UserOAuthType;
}

export class UpdateUserRequestDTO {
    @ApiProperty()
    @IsNumber()
    id:number;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.email !== undefined)
    @IsString()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.name !== undefined)
    @IsString()
    @Length(1, 255)
    name: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.phone !== undefined)
    @IsString()
    phone: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.phone !== undefined)
    @IsString()
    countryCode: string;

    @ApiPropertyOptional()
    @ValidateIf(obj => obj.profilePictureId !== undefined)

    @IsNumber()
    profilePictureId:number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    street?:string;
}
