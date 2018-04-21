"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The application environment
 */
exports.environment = {
    /** If the current application is in debug mode */
    isDebug: true,
    /** The mongoose connection string */
    connectionString: "mongodb://giacomodeliberali:CHV1a0UL56oeei3X@cluster0-shard-00-00-9gjz3.mongodb.net:27017,cluster0-shard-00-01-9gjz3.mongodb.net:27017,cluster0-shard-00-02-9gjz3.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",
    /** The JSON Web Token secret */
    jwtSecret: "Development13@unive!",
    /** The Google OAuth config */
    googleOAuth: {
        clientId: "220120198496-hkvm483iubjh5fnbrtu6kspv3kfjgat2.apps.googleusercontent.com",
        clientSecret: "YjVWdW92hf-RNYsU9nh7QOvC"
    }
};
