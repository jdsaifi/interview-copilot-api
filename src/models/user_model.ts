import mongoose from 'mongoose';
import { generateAccessToken } from '../utils/helpers';

interface IUser {
    username: string | null;
    email: string;
    password: string;
    first_name: string | null;
    last_name: string | null;
    login_at: Date | null;
    deleted_at: Date | null;
    deleted_by: mongoose.Types.ObjectId | null;
    generateAccessToken(): { token: string };
}

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            default: null
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        first_name: {
            type: String,
            default: null
        },
        last_name: {
            type: String,
            default: null
        },
        login_at: {
            type: Date,
            default: null
        },
        deleted_at: {
            type: Date,
            default: null
        },
        deleted_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

/**
 * Methods
 */

// generate access token
userSchema.methods.generateAccessToken = function () {
    const payload = {
        sub: this._id
    };
    return generateAccessToken(payload);
}; // END

// // generate refresh token
// userSchema.methods.generateRefreshToken = function () {
//     const payload = {
//         sub: this._id
//     };
//     return generateRefreshToken(payload);
// }; // END

export const User = mongoose.model<IUser>('User', userSchema);
