import { Request,Response,NextFunction} from "express";

const logReuest = (request:Request,response:Response,next:NextFunction) => {

      console.log(`Request Method: ${request.method}, Request Route: ${request.originalUrl}`);

      // transfer flow to the next middleware
      next();
}

export default logReuest;