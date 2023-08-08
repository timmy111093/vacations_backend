import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hash = (text:string):Promise<string> => {
      return new Promise((resolve,reject) => {
            bcrypt.genSalt(saltRounds, (err, salt) => {
                  if(err){
                        reject(err);
                  }
            bcrypt.hash(text,salt,(err, hash) => {
                  if(err){
                        reject(err);
                  }
                  resolve(hash);
            })
         })
      })
}

export const compareHash = (originalHash:string,storedHash:string):Promise<boolean> => {
      return new Promise((resolve,reject) => {
            bcrypt.compare(originalHash,storedHash, (err, result) => {
                  if(err){
                        reject(err);
                  }
                  resolve(result);
            })
      })
}