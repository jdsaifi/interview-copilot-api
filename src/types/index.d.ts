declare namespace Express {
    export interface Response {
        success: (
            code: number,
            data?: Array,
            metadata?: object,
            links?: object
        ) => void;
        error: (code: number, messages: string[] | string) => void;
    }
}

declare namespace Express {
    export interface Request {
        payload: {
            body?: any;
            query?: any;
            params?: any;
        };
    }
}
