import { Injectable } from '@nestjs/common';
import { TokenReason } from '@prisma/client';
import { MessageResponseDTO } from 'core/response/response.schema';
import DatabaseService from 'database/database.service';
import CreatePasswordTokenRequestDTO from './dto/request/create.request';

@Injectable()
export default class TokenService {
    constructor(private _dbService: DatabaseService) {}

    async CreatePasswordToken(data: CreatePasswordTokenRequestDTO) {
        const token = await this._dbService.token.create({
            data: {
                uuid: data.uuid,
                code: data?.code ?? data.uuid,
                reason: data.reason,
                userId: data.userId
            },
        });

        return token.uuid;
    }

    async GetToken(uuid: string, reason?: TokenReason) {
        const token = await this._dbService.token.findFirst({
            where: { uuid, ...(!!reason && { reason }) },
        });
        if (!token) return null;

        return token;
    }

    async VerifyCode(uuid: string, code: string, reason?: TokenReason) {
        const token = await this._dbService.token.findFirst({
            where: { uuid, code, ...(!!reason && { reason }) },
        });
        if (!token) return null;

        return token;
    }

    async Delete(id: number): Promise<MessageResponseDTO> {
        await this._dbService.token.delete({
            where: { id },
        });
        return { message: 'common.success' };
    }
}
