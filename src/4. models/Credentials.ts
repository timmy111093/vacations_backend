import Joi from "joi";

class Credentials {
      public email: string;
      public password: string;

      public constructor(credentials: Credentials){
            this.email = credentials.email;
            this.password = credentials.password;
      }

      private static validateSchema = Joi.object({
            email: Joi.string().required().min(4).max(40),
            password: Joi.string().required().min(4).max(20),
      });

      public validate(): string | undefined {
            const result = Credentials.validateSchema.validate(this);
            return result.error?.message;
       }
}

export default Credentials;