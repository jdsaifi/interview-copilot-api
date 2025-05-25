// import bcrypt from 'bcrypt';
import { CookieOptions, Request, Response } from 'express';
import UserService from '../services/user_service';
import { ApiError } from '../utils/api_error';
import asyncHandler from '../utils/async_handler';
import { StatusCodes } from 'http-status-codes';
import config from '../config';

// /** login handler */
// const login = asyncHandler(async (req: Request, res: Response) => {
//     const { email, password } = req.payload.body;

//     console.log('body: ', req.payload.body);
//     throw new ApiError({
//         httpCode: 400,
//         description: 'test'
//     });
// }); // end

// const AuthController = {
//     login: asyncHandler(async (req: Request, res: Response) => {
//         const { email, password } = req.payload.body;

//         console.log('body: ', req.payload.body);
//         throw new ApiError({
//             httpCode: 400,
//             description: 'test'
//         });

//         const user = await UserService.login(email, password);

//         // const hashedPassword = await bcrypt.hash(password, 10);
//         // console.log('hashedPassword: ', hashedPassword);
//         res.success(200, user);
//     }),
// }

// export default {
//     login
// };

class AuthController {
    static async login(req: Request, res: Response) {
        const { email, password } = req.payload.body;
        const response = await UserService.login(email, password);

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: config.env === 'production',
            domain: config.env === 'production' ? config.domain : undefined,
            sameSite: 'lax',
            path: '/'
        };

        res.cookie('access_token', response.access_token, cookieOptions);
        res.success(StatusCodes.OK, response);
    }

    static async logout(req: Request, res: Response) {
        res.clearCookie('access_token');
        res.success(StatusCodes.CREATED);
    }

    static async me(req: Request, res: Response) {
        // const token = req.cookies.access_token;
        // if (!token) {
        //     throw new ApiError({
        //         httpCode: StatusCodes.UNAUTHORIZED,
        //         description: 'No token'
        //     });
        // }

        const user = res.locals.user;

        // const decoded = jwt.verify(token, JWT_SECRET);
        // res.json({ user: decoded });
        res.success(StatusCodes.OK, {
            message: 'User fetched successfully',
            user
        });
    }
}

export default AuthController;
