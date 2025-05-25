import os from 'os';
import cluster from 'cluster';

import app from './app';
import config from './config';
import { MongooseConnect } from './utils/mongoose_connect';
import Logger from './utils/logger';

const runServer = (): void => {
    MongooseConnect()
        .then(() => {
            app.on('error', (error) => {
                Logger.error('App Error', error);
                throw error;
            });

            app.listen(config.port, async () => {
                Logger.info(`The server is running on port@${config.port}`);
            });
        })
        .catch((err) => {
            Logger.error('[Mongoose Connection Error]', err);
            process.exit(1);
        });
};

if (cluster.isPrimary) {
    const noCPU: number = config.env == 'development' ? 1 : os.cpus().length;
    for (let i = 0; i < noCPU; i++) {
        cluster.fork();
    }
} else {
    runServer();
}

process.on('unhandledRejection', (err) => {
    // Logger.error('unhandledRejection', err);
    console.error('unhandledRejection', err);
});

process.on('SIGTERM', () => {
    // Logger.error('SIGTERM received. Shutting down gracefully');
    console.error('SIGTERM received. Shutting down gracefully');
});
