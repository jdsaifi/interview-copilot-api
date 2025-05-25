import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api_error';

// import multer from 'multer';

interface ErrorWithMongoServerError extends Error {
    errorResponse: {
        code: number;
        keyPattern: {
            [key: string]: string | number;
        };
    };
}
export const errorHandler = (
    err: ErrorWithMongoServerError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (typeof res?.error !== 'undefined') {
        if (err instanceof ApiError) {
            return res.error(err.httpCode, err?.message);
        }

        // if (err instanceof multer.MulterError) {
        //     return res.error(StatusCodes.BAD_REQUEST, err?.message);
        // }

        if (err.name === 'MongoServerError') {
            const errorResponse = err?.errorResponse;
            if (errorResponse?.code === 11000) {
                const keys = Object.keys(errorResponse.keyPattern);
                const messages = keys.map(
                    (key) => `${key} can not be duplicate`
                );

                return res.error(StatusCodes.BAD_REQUEST, messages);
            }
        }
        return res.error(StatusCodes.INTERNAL_SERVER_ERROR, err?.message);
    }
    throw err;
};
