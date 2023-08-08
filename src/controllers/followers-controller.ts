import express, {Request,Response,NextFunction} from 'express';
import * as followersLogic from '../5. logic/followers-logic';
import GraphData from '../4. models/GraphData';
import {parse as json2csv} from 'json2csv';
import fs from 'fs/promises';
import path from 'path';
import  verifyAdmin  from '../3. middleware/verifyAdmin';
import verifyLoggedIn from '../3. middleware/verify-logged-in';

const router = express.Router();

// add new follower by vacationId and userId
router.post('/vacations/follow/:userId([0-9]+)/:vacationId([0-9]+)',verifyLoggedIn, async (req:Request,res:Response,next:NextFunction) => {
      try{
            const userId = +req.params.userId;
            const vacationId = +req.params.vacationId;
            await followersLogic.followVacation(userId,vacationId);
            res.sendStatus(201);
      }catch(err){
            next(err);
      }
});

// unlike a vacation - delete follower by vacationId and userId
router.delete('/vacations/unfollow/:userId([0-9]+)/:vacationId([0-9]+)',verifyLoggedIn, async (req:Request,res:Response,next:NextFunction) => {
      try{
            const userId = +req.params.userId;
            const vacationId = +req.params.vacationId;
            await followersLogic.unFollowVacation(userId,vacationId);
            res.sendStatus(204);
      }catch(err){
            next(err);
      }
});

router.get('/vacations/followersByVacation/:vacationId([0-9]+)/:userId([0-9]+)',verifyLoggedIn, async (req:Request,res:Response,next:NextFunction) => {
      try{
            const userId = +req.params.userId;
            const vacationId = +req.params.vacationId;
            const isFollowing = await followersLogic.getFollowersByVacation(vacationId,userId);
            res.json(isFollowing);
      }catch(err:any){
            next(err);
      }
});

// get the number of followers by chosen vacation
router.get('/vacations/followersByVacation/:vacationId([0-9]+)',verifyLoggedIn, async (req:Request,res:Response,next:NextFunction) => {
      try{
            const vacationId = +req.params.vacationId;
            const followersNumber = await followersLogic.getCountOfFollowers(vacationId);
            res.json(followersNumber);
      }catch(err:any){
            next(err);
      }
});

// get array of objects of followers and vacation destination for the graph
router.get('/vacations/statistics',[verifyLoggedIn,verifyAdmin], async (req:Request,res:Response,next:NextFunction) => {
      try{
            const graphData = await followersLogic.getFollowersAndVacations();
            console.log(graphData)
            res.json(graphData);
      }catch(err:any){
            next(err);
      }
});

router.get('/vacations/favorites/:userId([0-9]+)',verifyLoggedIn, async(req:Request,res:Response,next:NextFunction) => {
      try{
            const userId = +req.params.userId;
            const favorites = await followersLogic.getFavoritesVacations(userId);
            res.json(favorites);
      }catch(err:any){
            next(err);
      }
})

router.get('/followers/csv',[verifyLoggedIn,verifyAdmin], async (request: Request, response: Response, next: NextFunction) => {

      try {
          const followers = await followersLogic.getFollowersAndVacations();
    
          //specify the fields/columns names you want to export
          const fields = ["destination", "followers"];
          const csv = json2csv(followers as GraphData[], {fields});

          //write csv string to a file
          const dateTime = Date.now();
          const dirPath = path.join(__dirname, "..", "..", "public", "exports");
          const filePath = path.join(dirPath, `vacations-${dateTime}.csv`);
    
          //create the directory if it does not exists
          await fs.mkdir(dirPath, { recursive: true });
          await fs.writeFile(filePath, csv);
    
          //set the headers so the browser knows this is a downloadable file
          response.setHeader('Content-Type', "text/csv");
          response.setHeader("Content-Disposition", `attachment; filename=vacations-${dateTime}.csv`);
    
          //response as download
          response.download(filePath);
          
      } catch (err) {
          next(err);
      }
    });



export default router;