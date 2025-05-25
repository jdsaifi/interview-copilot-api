import { getUID } from '../utils/helpers';

const config = {
    domain: process.env.DOMAIN || 'localhost',
    env: process.env.ENV || 'development',
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || getUID(),
    mongoURI:
        `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME || 'testdb'}` ||
        'mongodb://localhost:27017/test',
    openrouter_api_key: process.env.OPENROUTER_API_KEY || ''
};
export default config;
