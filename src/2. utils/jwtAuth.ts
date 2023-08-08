import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../4. models/User';

dotenv.config();

export const generateToken = (user: User) => {

    // create a container for the user object
    const container = { user };

    // Create expiration time
    const options = { expiresIn: '0.01h' };

    // generate token
    return jwt.sign(container, `${process.env.SECRET_KEY}`, options);
}