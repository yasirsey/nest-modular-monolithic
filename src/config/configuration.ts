// src/config/configuration.ts
export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
        uri: process.env.MONGODB_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
    oauth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackUrl: process.env.GOOGLE_CALLBACK_URL,
        },
        facebook: {
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID,
            teamId: process.env.APPLE_TEAM_ID,
            keyId: process.env.APPLE_KEY_ID,
            privateKey: process.env.APPLE_PRIVATE_KEY,
            callbackUrl: process.env.APPLE_CALLBACK_URL,
        },
    },
    frontend: {
        url: process.env.FRONTEND_URL,
    },
    app: {
        name: process.env.APP_NAME
    }
});