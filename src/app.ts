import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import morganMiddleware from './middlewares/morgan';
import responseFormatter from './middlewares/response_formattor';
import { errorHandler } from './middlewares/errors';
import Logger from './utils/logger';
import router from './routes';
import cors from 'cors';
import path from 'path';

const app: Express = express();

// Basic setup: Allow all origins (good for development)
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://admin.colloquis.ai',
        'https://demo.colloquis.ai/'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
};
app.use(cors(corsOptions));

// app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/** middlewares */
app.use(morganMiddleware);
app.use(responseFormatter);

app.get('/ping', (_, res) => {
    res.send(new Date());
});

/** routes */
app.use('/api', router);

/** error handler middleware */
app.use(errorHandler);

/** unhandeled error */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // log error
    Logger.error('[Error]', err);
    // Handle the error
    res.status(500).json({
        status: 'error',
        error: {
            code: 500,
            messages: ['Internal server error.', err?.message]
        },
        metadata: {
            timestamp: new Date().toISOString()
        }
    });
});

export default app;
