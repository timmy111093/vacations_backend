import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../4. models/User";
import { UnAuthorizedError } from "../4. models/Error";
import { getOneUser } from "../5. logic/auth-logic";

declare global {
      namespace Express{
            interface Request{
                  user?: User | any;
            }
      }
}

const verifyLoggedIn = async (request: Request, response: Response, next: NextFunction) => {

      //get the jwt from the authorization header
      const token = request.headers.authorization?.split(' ')[1];
  
      if (!token) {
          const error = new UnAuthorizedError('Unauthorized');
          next(error);
          return;
      }
  
      // verify the jwt
      jwt.verify(token, `${process.env.SECRET_KEY}`, async (err, decoded) => {
          if (err) {
              // JWT is invalid, return an error response
              const error = new UnAuthorizedError('Unauthorized');
              next(error);
          } else {
              // JWT is valid, save the decoded payload inside the request
              const {user} = decoded as JwtPayload;
              request.user = user;
              next();
          }
      })
  }
export default verifyLoggedIn;