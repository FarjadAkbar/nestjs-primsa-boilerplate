import { config } from 'dotenv';
config();

const AppConfig = {
    APP: {
        NAME: 'API',
        PORT: Number(process.env.APP_PORT),
        DEBUG: Boolean(process.env.APP_DEBUG),
        LOG_LEVEL: Number(process.env.APP_LOG_LEVEL),
        TOKEN_EXPIRATION: Number(process.env.APP_TOKEN_EXPIRATION),
        REMEMBER_TOKEN: Number(process.env.APP_REMEMBER_TOKEN_EXPIRATION) ?? 7776000,
    },
    DATABASE: {
        URL: process.env.APP_DATABASE_URL,
    },
    EMAIL:{
        SENDGRID_API_KEY:process.env.SENDGRID_API_KEY,
        FROM_EMAIL: process.env.FROM_EMAIL,
    }
};

export default AppConfig;
