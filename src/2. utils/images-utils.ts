import Vacation from "../4. models/Vacation";
import {v4 as uuid} from 'uuid';


export const saveNewImgNameToImagesFolder = async (vacation:Vacation) => {
      if(vacation.image){
            const extension = vacation.image.name.split('.').pop();
            vacation.imageName = `${uuid()}.${extension}`;
            await vacation.image.mv(`./src/1. assets/images/${vacation.imageName}`);
            return vacation.imageName;
      }
}