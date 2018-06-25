"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const dotenv = require("dotenv");
const result = dotenv.config({
    path: path.resolve(process.cwd(), `${process.env.NODE_ENV || 'development'}.env`)
});
if (result.error) {
    throw result.error;
}
else {
    console.log(`Environment variables loaded from ${result.parsed.envFile}\n`);
}
/**
 * The application environment
 */
exports.environment = {
    /** If the current application is in debug mode */
    isDebug: true,
    /** The mongoose connection string */
    // connectionString: "mongodb://giacomodeliberali:CHV1a0UL56oeei3X@cluster0-shard-00-00-9gjz3.mongodb.net:27017,cluster0-shard-00-01-9gjz3.mongodb.net:27017,cluster0-shard-00-02-9gjz3.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",
    connectionString: process.env.dbConnectionString,
    /** The JSON Web Token secret */
    jwtSecret: process.env.jwtSecret,
    /** The Google OAuth config */
    googleOAuth: {
        clientId: process.env.googleOAuthClientId,
        clientSecret: process.env.googleOAuthClientSecret
    },
    /** The emails configuration */
    email: {
        service: process.env.emailService,
        host: null,
        port: null,
        auth: {
            user: process.env.emailUser,
            password: process.env.emailPassword
        }
    }
};
