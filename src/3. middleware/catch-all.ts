import {Request,Response,NextFunction} from 'express';
import logger from '../2. utils/logger';


const catchAll = async (err:any,request:Request,response:Response,next:NextFunction) => {

      // log the error
      console.log(err);

      await logger('logger-fs', err.message);

      //transfer flow chain to the nest middleware or controller(router)
      response.status(err.status).send(err.message);

}

export default catchAll;