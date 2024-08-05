import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import RedisModule from 'core/cache/redis.module';
import { HttpExceptionFilter } from 'core/exceptions/http.exception';
import { TranslatorModule } from 'nestjs-translator';
import UserModule from 'modules/app/user/user.module';
import DatabaseModule from 'database/database.module';
import AuthModule from 'modules/app/auth/auth.module';
import AuthGuard from 'modules/app/auth/auth.guard';
import DeviceModule from 'modules/app/device/device.module';
import MediaModule from 'modules/app/media/media.module';
import EmailModule from 'modules/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TranslatorModule.forRoot({
            defaultLang: 'en',
            global: true,
            requestKeyExtractor(req) {
                return req.headers['locale'];
            },
            translationSource: './dist/i18n',
        }),
        EventEmitterModule.forRoot(),
        RedisModule,
        DatabaseModule,
        AuthModule,
        UserModule,
        DeviceModule,
        MediaModule,
        EmailModule,
        HttpModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_GUARD, useClass: AuthGuard },
    ],
})
export class AppModule {}
