// import { User } from '@/models/user.model';
// import { ApiError } from '@/utils/api.error';
import { StatusCodes } from 'http-status-codes';
// import asyncHandler from '@/utils/async.handler';
import { JwtPayload, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/async_handler';
import { ApiError } from '../utils/api_error';
import config from '../config';
import { User } from '../models/user_model';
import Logger from '../utils/logger';
// import { ACCESS_TOKEN_SECRET } from '@/constants';
// import Logger from '@/library/logger';

export const authorizeRequest = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('\n\nheader: ', req.cookies);
            const token: string =
                req.cookies?.access_token ||
                req.headers['x-access-token'] ||
                req.header('Authorization')?.replace('Bearer ', '') ||
                req.body.access_token ||
                req.query.access_token;

            console.log('\n\ntoken: ', token);

            if (!token) {
                throw new ApiError({
                    httpCode: StatusCodes.UNAUTHORIZED,
                    description: 'E-399 Invalid access token'
                });
            }

            const tokenKey: string = config.accessTokenSecret || 'NOSECRET';
            const decoded: JwtPayload | string = verify(token, tokenKey);
            const { sub } = decoded;

            const user = await User.findById(sub);

            if (!user) {
                throw new ApiError({
                    httpCode: StatusCodes.UNAUTHORIZED,
                    description: 'E-395 Invalid access token'
                });
            }

            // todo: send all permissions
            res.locals.user = {
                id: user?._id,
                email: user?.email
            };
            next();
        } catch (err) {
            Logger.error('[Auth Middleware Error]', err);

            throw new ApiError({
                httpCode: StatusCodes.UNAUTHORIZED,
                description: 'E-379 Invalid access token'
            });
        }
    }
);
