import multer, { Multer } from 'multer';
import path from 'path';
import { Request } from 'express';
import { ApiError } from '../utils/api_error';
import { StatusCodes } from 'http-status-codes';

// Configure storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    }
});

// File filter
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError({
                httpCode: StatusCodes.BAD_REQUEST,
                description: 'Only PDF and DOC files are allowed'
            })
        );
    }
};

// Configure multer
export const upload: Multer = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    }
});
