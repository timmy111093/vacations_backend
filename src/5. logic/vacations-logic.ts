import {execute} from '../2. utils/dal';
import fs from 'fs';
import Vacation from '../4. models/Vacation';
import { ResourceNotFoundError, ValidationError } from '../4. models/Error';
import { saveNewImgNameToImagesFolder } from '../2. utils/images-utils';
import { OkPacket } from 'mysql';

//GET all vacations
export const getAllVacations = async (page:number):Promise<Vacation[]> => {
      // get all vacations from db
      const sql = `
      SELECT * FROM vacation_details
    ORDER BY vacationStart ASC
    LIMIT 10
    OFFSET ?
      `;
      return await execute<Vacation[]>(sql,[page]);
}


// add new vacation
export const addVacation = async (vacation:Vacation):Promise<Vacation> => {

      //validation
      const error = vacation.validate();
      console.log('error add vacation', error);
      if (error) throw new ValidationError(error);

      // date validation
      const today = new Date();
      if(new Date(vacation.vacationStart) < today) throw new ValidationError("must choose day later then today to start..");
      if(new Date(vacation.vacationStart) > new Date(vacation.vacationEnd)) throw new ValidationError("Vacation start day must be before the end day...");

      let {destination,description,vacationStart,vacationEnd,price,image,imageName} = vacation;

      // save image to folder if exists
      if(image){
            // get the image name as uuid (random string)
            imageName = await saveNewImgNameToImagesFolder(vacation);
            delete vacation.image;
      }
      const sqlToAdd = 
      `
            INSERT INTO vacation_details (vacationId,destination,description,vacationStart,vacationEnd,price,imageName)
            VALUES(DEFAULT,?,?,?,?,?,?); 
      `;

      const info = await execute<OkPacket>(sqlToAdd,[destination,description,vacationStart,vacationEnd,price,imageName]);
      vacation.vacationId = info.insertId;

      const sqlToGet = `SELECT * FROM vacation_details;`;
      const vacations = await execute<Vacation[]>(sqlToGet);

      // add the vacation to the the array
      vacations.push(vacation);

      return vacation;
}


// // update existing vacation

export const updateVacation = async (vacation:Vacation):Promise<Vacation> => {

      //validation
      const error = vacation.validate();
      console.log('error updating vacation', error);
      if (error) throw new ValidationError(error);

      const startingDate = new Date(vacation.vacationStart);
      if(startingDate > new Date(vacation.vacationEnd)) throw new ValidationError("Start date must be before End date..")

      if(vacation.image){
            console.log(vacation);
            const currentImg = vacation.imageName;
            if(fs.existsSync(`./src/1. assets/images/${currentImg}`)){
                  fs.unlinkSync(`./src/1. assets/images/${currentImg}`);
            }
            // save new image name
            vacation.imageName = await saveNewImgNameToImagesFolder(vacation);
            delete vacation.image;
      }

      const sqlToUpdate = `UPDATE vacation_details
      SET destination = ?, description = ?, vacationStart = ?, vacationEnd = ?, price = ?, imageName = ?
      WHERE vacationId = ?;`;

      await execute<Vacation>(sqlToUpdate,[vacation.destination, vacation.description,vacation.vacationStart,vacation.vacationEnd,vacation.price,vacation.imageName,vacation.vacationId]);

      return vacation;
}


// deleting vacation
export const deleteVacation = async (id:number):Promise<void> => {
      
      const getAllVacationsSql = `SELECT * FROM vacation_details;`;
      const allVacations = await execute<Vacation[]>(getAllVacationsSql);

      const deleteSql = `DELETE FROM vacation_details WHERE vacationId = ?`;

      await execute(deleteSql,[id]);

      const index = allVacations.findIndex((vac) => vac.vacationId === id);
      allVacations.splice(index,1);
}






