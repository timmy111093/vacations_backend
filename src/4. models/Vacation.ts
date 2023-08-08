import Joi from 'joi';
import {UploadedFile} from 'express-fileupload';

class Vacation {
     public vacationId:number;
     public destination:string;
     public description:number;
     public vacationStart: string;
     public vacationEnd:string;
     public price:number;
     public image?: UploadedFile;
     public imageName?: string;
     
     public constructor(vacation:Vacation){
      this.vacationId = vacation.vacationId;
      this.destination = vacation.destination;
      this.description = vacation.description;
      this.vacationStart = vacation.vacationStart;
      this.vacationEnd = vacation.vacationEnd;
      this.price = vacation.price;
      this.image = vacation.image;
      this.imageName = vacation.imageName;
     }

     public static validationSchema = Joi.object({
          vacationId: Joi.number().optional().positive().integer(),
          destination: Joi.string().required().min(2).max(30),
          description: Joi.string().required().min(2).max(1000),
          vacationStart: Joi.string().required(),
          vacationEnd: Joi.string().required(),
          price: Joi.number().required().positive().max(10000),
          image:Joi.object().optional(),
          imageName: Joi.string().optional()
     });

     public validate(): string | undefined {
          const result = Vacation.validationSchema.validate(this);
          return result.error?.message;
     }
}

export default Vacation;

