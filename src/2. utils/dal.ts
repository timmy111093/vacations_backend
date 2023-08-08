import mysql from 'mysql';
import dotenv from 'dotenv';
import { Error } from '../4. models/Error';

dotenv.config();

// create connection pool to mysql
const connection = mysql.createPool({
      host:process.env.DB_HOST,
      user:process.env.DB_USER,
      password:process.env.DB_PASSWORD,
      database:process.env.DB_DATABASE
});

export const execute = <T>(sqlQuery:string,values?:any[]):Promise<T> => {

      return new Promise<any>((resolve,reject) => {
            connection.query(sqlQuery,values, (err,result) => {

                  if(err){
                        reject(new Error(err.sqlMessage || 'SQL Error', 500));
                  }else{
                        resolve(result);
                  }
            })
      })
}

