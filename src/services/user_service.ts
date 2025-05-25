import bcrypt from 'bcrypt';
import { User } from '../models/user_model';
import { ApiError } from '../utils/api_error';

class UserService {
    static async login(email: string, password: string) {
        const user = await User.findOne({ email });
        console.log('user: ', user);

        if (!user) {
            throw new ApiError({
                httpCode: 400,
                description: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError({
                httpCode: 400,
                description: 'Invalid email or password'
            });
        }

        const accessToken = user.generateAccessToken();

        return {
            id: user._id,
            email: user.email,
            access_token: accessToken?.token
        };
    }
}

export default UserService;
