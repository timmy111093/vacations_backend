import { generateToken } from "../2. utils/jwtAuth";
import {execute} from '../2. utils/dal';
import User from "../4. models/User";
import Role from "../4. models/Role";
import Credentials from "../4. models/Credentials";
import { Error, ResourceNotFoundError, UnAuthorizedError, ValidationError } from "../4. models/Error";
import { compareHash, hash } from "../2. utils/bcrypt";
import { OkPacket } from "mysql";


export const register = async (user: User): Promise<string> => {
    // validate the email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailPattern.test(user.email);
    // validate all user object
    const error = user.validate();
    if (error) throw new ValidationError(error);
    if(!isValid) throw new ValidationError("the email is invalid...");

    const {firstName,lastName,email,password} = user;
    const sql = `SELECT * FROM users;`;
    const users = await execute<User[]>(sql);

    // if the email is taken
    if(users.some(u => u.email === email)){
        throw new ValidationError('This email is already taken');
    }

    try{
        user.userRole = Role.User;
    const hashedPassword = await hash(password);
    // save user back to db with hash
    const addUserSql = `INSERT INTO users (userId,firstName,lastName,email,password) VALUES(DEFAULT, ?, ?, ?, ?);`;
    const info = await execute<OkPacket>(addUserSql,[firstName,lastName,email,hashedPassword]);
    user.userId = info.insertId;

    //generate token
    return generateToken(user);

    }catch(err:any){
        throw new Error('an error occured while generating salt...', 500);
    }
}

export const login = async (credentials: Credentials): Promise<string> => {

    // validation
    const error = credentials.validate();
    if (error) throw new ValidationError(error);
    try {
        const sql = `SELECT * FROM users WHERE email = ?`;
    
        const users = await execute<User[]>(sql,[credentials.email]);
    
        if (users.length === 0) throw new UnAuthorizedError("Incorrect username or password");
    
        // user data -  compare the password
        const user = users[0];
        const match = await compareHash(credentials.password,user.password);
    
        if(!match){
            throw new UnAuthorizedError("Incorrect username or password");
        }
        return generateToken(user);
    
        }catch(err){
            throw new Error("Incorrect username or password",401);
        }
}

export async function getOneUser(id: number): Promise<User> {
    const sql = "SELECT * FROM users WHERE userId = ?";
    const users = await execute<User[]>(sql,[`${id}`]);
    if (users.length === 0) throw new ResourceNotFoundError(id);

    return users[0];
}