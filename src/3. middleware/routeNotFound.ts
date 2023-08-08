import {Request,Response,NextFunction} from 'express';
import { RouteNotFoundError } from '../4. models/Error';

const routeNotFound = (request:Request,response:Response,next:NextFunction) => {

      const error = new RouteNotFoundError(request.originalUrl);
      next(error);
}


export default routeNotFound;

