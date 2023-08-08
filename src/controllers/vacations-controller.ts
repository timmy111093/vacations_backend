import express, {Request,Response,NextFunction} from 'express';
import * as vacationLogic from '../5. logic/vacations-logic';
import path from 'path';
import Vacation from '../4. models/Vacation';
import verifyLoggedIn from '../3. middleware/verify-logged-in';
import verifyAdmin from '../3. middleware/verifyAdmin';

const router = express.Router();

// get vacations by limit and offset
router.get(`/vacations/:page([0-9]+)`,verifyLoggedIn, async (req:Request,res:Response) => {
      const page = +req.params.page;
      const vacations = await vacationLogic.getAllVacations(page);
      res.json(vacations);
});

//get image by imageName from assets/images
router.get('/vacations/images/:imageName', async (req:Request,res:Response,next:NextFunction) => {
      try{
            const imageName = req.params.imageName;
            const absolutePath = path.join(__dirname,'..','1. assets','images',imageName);
            res.sendFile(absolutePath);
      }catch(err:any){
            next(err);
      }
});

// add a new vacation (if user is admin)
router.post('/vacations',[verifyLoggedIn,verifyAdmin], async (req:Request,res:Response,next:NextFunction) => {
      try{
            req.body.image = req.files?.image;

            const vacation = new Vacation(req.body);
            const addedVacation = await vacationLogic.addVacation(vacation);
            res.status(201).json(addedVacation);
      }catch(err){
            next(err);
      }
});

// update vacation (if user is admin)
router.put('/vacations/update/:id([0-9]+)',[verifyLoggedIn,verifyAdmin], async (req:Request,res:Response,next:NextFunction) => {
      try{
            req.body.image = req.files?.image;
            const id = +req.params.id;
            req.body.vacationId = id;
            const vacation = new Vacation(req.body);
            const updatedVacation = await vacationLogic.updateVacation(vacation);
            res.json(updatedVacation);
      }catch(err:any){
            next(err);
      }
})

// delete vacation (if user is admin)
router.delete('/vacations/delete/:vacationId([0-9]+)',[verifyLoggedIn,verifyAdmin], async (req:Request,res:Response,next:NextFunction) => {
      try{
            const id = +req.params.vacationId;
            await vacationLogic.deleteVacation(id);
            res.sendStatus(204);
      }catch(err){
            next(err);
      }
});



export default router;