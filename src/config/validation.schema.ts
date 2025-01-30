// src/config/validation.schema.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(5000),
    APP_NAME: Joi.string().default('Nest Modular Monolithic'),

    // MongoDB
    MONGODB_URI: Joi.string().required(),

    // JWT
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

    // OAuth
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_CALLBACK_URL: Joi.string().required(),

    FACEBOOK_CLIENT_ID: Joi.string().required(),
    FACEBOOK_CLIENT_SECRET: Joi.string().required(),
    FACEBOOK_CALLBACK_URL: Joi.string().required(),

    APPLE_CLIENT_ID: Joi.string().required(),
    APPLE_TEAM_ID: Joi.string().required(),
    APPLE_KEY_ID: Joi.string().required(),
    APPLE_PRIVATE_KEY: Joi.string().required(),
    APPLE_CALLBACK_URL: Joi.string().required(),

    // Frontend URL
    FRONTEND_URL: Joi.string().required(),
});

