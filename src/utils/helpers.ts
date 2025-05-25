import crypto from 'crypto';
import config from '../config';
import { sign } from 'jsonwebtoken';
/** generate unique ID */
export const getUID = () => {
    return crypto.randomBytes(16).toString('hex');
};

/** generate access token */
export const generateAccessToken = (data: object) => {
    // const expiresIn: string = ACCESS_TOKEN_EXPIRY || '8h';
    const tokenKey: string = config.accessTokenSecret;
    const token = sign(data, tokenKey);
    // {
    //     expiresIn: expiresIn
    // }

    return {
        token
        // expiresIn: ms(expiresIn)
    };
}; // END
