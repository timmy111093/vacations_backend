import express from 'express';
import expressFileUpload from 'express-fileupload';
import catchAll from './3. middleware/catch-all';
import logReuest from './3. middleware/log-request';
import routeNotFound from './3. middleware/routeNotFound';
import vacationController from './controllers/vacations-controller';
import cors from 'cors';
import authcontroller from './controllers/auth-controller';
import followersController from './controllers/followers-controller';

// create a server
const server = express();

server.use(cors({
      origin: process.env.frontEndUrl
}));

server.use(logReuest);

// integrate express file upload middleware to handle uploaded files - and work with formData
server.use(expressFileUpload());

// tell express to take the json  in requests body and attache it to the body object
server.use(express.json());

server.use('/',vacationController);
server.use('/api', authcontroller);
server.use('/api', vacationController);
server.use('/api',followersController);


// in the end - middleware for errors
// example
server.use('*', routeNotFound);

// catch all middleware
server.use(catchAll);

// running the server on a port
server.listen(process.env.PORT, () => {
      console.log(`listening on ${process.env.DB_HOST}:${process.env.PORT}.....`);
});
