// import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import AppConfig from 'configs/app.config';
import { EmailTemplates } from '../../constants';
import { Logger } from 'helpers/logger.helper';
import { SendEmailArgs } from './types';

/* Import email templates here */
import WelcomeTemplate from './templates/welcome';
import ForgetPasswordTemplate from './templates/forget_password';
import VerifyEmailTemplate from './templates/verify_email';

const TEMPLATES: { [key in keyof typeof EmailTemplates]: (data: any) => string } = {
    WELCOME: WelcomeTemplate,
    VERIFY_EMAIL: VerifyEmailTemplate,
    FORGET_PASSWORD: ForgetPasswordTemplate
};
// const sgMail = require('@sendgrid/mail')

@Injectable()
export default class EmailService {
    // private _sesClient: SESClient = null;

    constructor() {
        // sgMail.setApiKey(AppConfig.EMAIL.SENDGRID_API_KEY)
        
        // this._sesClient = new SESClient({
        //     credentials: {
        //         accessKeyId: AppConfig.AWS.ACCESS_KEY,
        //         secretAccessKey: AppConfig.AWS.SECRET_KEY,
        //     },
        //     region: AppConfig.AWS.REGION,
        // });
    }

    async Send(args: SendEmailArgs<any>) {
        // const command = new SendEmailCommand({
        //     Destination: { ToAddresses: [args.email] },
        //     Source: AppConfig.EMAIL.FROM_EMAIL,
        //     Message: {
        //         Subject: { Data: args.subject, Charset: 'utf8' },
        //         Body: { Html: { Data: TEMPLATES[args.template](args.data), Charset: 'utf8' } },
        //     },
        // });
        // const result = await this._sesClient.send(command);
        // Logger.Debug(result, '[EMAIL]');
        // Logger.Info(`Email sent to ${args.email} of type ${args.template}`, '[EMAIL]');
    
        try {

            
            const mailOptions = {
                from: AppConfig.EMAIL.FROM_EMAIL,
                to:args.email,
                // text,
                // cc,
                subject:args.subject,
                html:TEMPLATES[args.template](args.data),
            };
            
            // const result = await sgMail.send(mailOptions)
        // Logger.Debug(result, '[EMAIL]');
        Logger.Info(`Email sent to ${args.email} of type ${args.template}`, '[EMAIL]');
        } catch (error) {
            Logger.Info('Email sent failed')
            Logger.Error(error);
        }
    }
}