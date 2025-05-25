import { Request, Response, NextFunction, CookieOptions } from 'express';
import { ApiResponse } from '../utils/api_response';

const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
    res.success = (code = 200, data = [], metadata = {}, links = {}) => {
        res.status(code).json(new ApiResponse(data, metadata, links));
    };

    res.error = (code: number = 400, messages: string[] | string = []) => {
        res.status(code).json({
            status: 'error',
            error: {
                code,
                messages: Array.isArray(messages) ? messages : [messages]
            },
            metadata: {
                timestamp: new Date().toISOString()
            }
        });
    };

    next();
};

export default responseFormatter;
