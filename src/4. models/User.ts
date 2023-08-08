import Role from "./Role";
import joi from 'joi';

class User {
      public userId:number;
      public firstName: string;
      public lastName: string;
      public email:string;
      public password: string;
      public userRole?: Role

      public constructor(user:User){
            this.userId = user.userId;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.email = user.email;
            this.password = user.password;
            this.userRole = user.userRole;
      }

     private static validationSchema = joi.object({
      userId: joi.number().optional().positive().integer(),
      firstName: joi.string().required().min(2).max(30),
      lastName: joi.string().required().min(2).max(30),
      email: joi.string().required().min(4).max(40),
      password: joi.string().required().min(4).max(20),
      userRole: joi.forbidden().optional()
 });

 public validate(): string | undefined {
      const result = User.validationSchema.validate(this);
      return result.error?.message;
 }
}

export default User;