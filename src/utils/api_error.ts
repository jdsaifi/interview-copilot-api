interface ApiErrorArgs {
    name?: string;
    httpCode: number;
    description: string;
    isOperational?: boolean;
}

export class ApiError extends Error {
    public readonly name: string;
    public readonly httpCode: number;
    public readonly isOperational: boolean = true;

    constructor(args: ApiErrorArgs) {
        super(args.description);

        this.name = args.name || 'Error';
        this.httpCode = args.httpCode;

        if (args.isOperational !== undefined) {
            this.isOperational = args.isOperational;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}
