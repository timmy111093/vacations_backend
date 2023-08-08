import express, {Request,Response,NextFunction} from 'express';
import Credentials from '../4. models/Credentials';
import User from '../4. models/User';
import { login, register } from '../5. logic/auth-logic';

const router = express.Router();

router.post('/auth/register', async (request:Request,response:Response,next:NextFunction) => {
      try{
            const user = new User(request.body);
            
            const token = await register(user);
            response.status(201).json(token);
      }catch(err:any){
            next(err);
      }
});

router.post('/auth/login', async (request:Request,response:Response,next:NextFunction) => {
      try{
            const credentials = new Credentials(request.body);
            const token = await login(credentials);
            response.json(token);
      }catch(err:any){
            next(err);
      }
});




export default router;