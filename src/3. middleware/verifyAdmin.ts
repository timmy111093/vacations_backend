import { Request,Response,NextFunction } from "express";
import { UnAuthorizedError } from "../4. models/Error";
import Role from "../4. models/Role";

const verifyAdmin = async (request:Request,response:Response,next:NextFunction) => {
      const user = request?.user;
      
      const unauthorizedError = new UnAuthorizedError('you are not authorized...!');
      if(!user){
            next(unauthorizedError);
      }
      const isAdmin = user?.userRole === Role.Admin;
      if(!isAdmin){
            next(unauthorizedError);
      }
      next();
}

export default verifyAdmin;