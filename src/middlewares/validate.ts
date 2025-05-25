import { Request, Response, NextFunction } from 'express';
import { ZodError, AnyZodObject, ZodIssue } from 'zod';

import { StatusCodes } from 'http-status-codes';
import config from '../config';
import Logger from '../utils/logger';
import { ApiError } from '../utils/api_error';

const validateRequest =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (config.env === 'development') {
                console.log('\n==================================\n');
                console.log('######### Body Requests #########\n');
                console.log(req.body);

                console.log('\n\n######### Params Requests #########\n');
                console.log(req.params);

                console.log('\n\n######### Query Requests #########\n');
                console.log(req.query);
                console.log('\n==================================\n\n');
            }

            const data = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            req.payload = data;
            return next();
        } catch (error) {
            Logger.error('[Validate Request Error]', error);

            if (error instanceof ZodError) {
                const errorMessages: string[] = error.errors.map(
                    (issue: ZodIssue) =>
                        `${issue?.path.join('.')} is ${issue?.message}`
                );

                res.error(StatusCodes.BAD_REQUEST, errorMessages);
            } else {
                res.error(StatusCodes.BAD_REQUEST, ['Internal Server Error']);
            }
        }
    };

export const validateZodSchema = async (schema: AnyZodObject, body: object) => {
    try {
        await schema.parseAsync(body);
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages: string[] = error.errors.map(
                (issue: ZodIssue) =>
                    `${issue?.path.join('.')} is ${issue?.message}`
            );

            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: errorMessages[0]
            });
        } else {
            throw new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Internal Server Error'
            });
        }
    }
};

export default validateRequest;
