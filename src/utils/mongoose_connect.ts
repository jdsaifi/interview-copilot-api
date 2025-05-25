import mongoose from 'mongoose';
import config from '../config';
import Logger from './logger';
// mongoose events
mongoose.connection.on('connected', function () {
    Logger.info('[Mongoose connected]');
});

mongoose.connection.on('error', function (err) {
    Logger.error('[Mongoose connection has occured error]', err);
});

mongoose.connection.on('disconnected', function () {
    Logger.warn('[Mongoose connection is disconnected]');
});

export const MongooseConnect = async () => {
    try {
        Logger.info(`[Mongoose connecting] ${config.mongoURI}`);
        const connectionInstance = await mongoose.connect(config.mongoURI);
        Logger.info(
            `Mongoose Connection Hosted @ ${connectionInstance.connection.host}`
        );
    } catch (err) {
        Logger.error('[Mongoose connection failed]', err);
        process.exit(1);
    }
};
