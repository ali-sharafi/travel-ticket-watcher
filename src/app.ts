import './config/config';
import express, { Request, Response, NextFunction } from 'express';
import index from './routes';
import fs from 'fs';
import bodyParser from 'body-parser';
import { TravelController } from './controllers/travelController';
import logger from './utils/logger';

const traveller = new TravelController();

const app = express();
app.use(bodyParser.json());

app.use('/api', index);

if (!fs.existsSync(__dirname + '/storage')) {
    fs.mkdir(__dirname + '/storage', (err) => {
        if (err) logger('Some error occure while create storage directory: ' + err.message)
    });
}

if (!fs.existsSync(__dirname + '/logs')) {
    fs.mkdir(__dirname + '/logs', (err) => {
        if (err) logger('Some error occure while create logs directory: ' + err.message)
    });
}
traveller.read();
setInterval(() => {
    traveller.read();
}, 1000 * 60 * 5)//Every 10 minutes

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err)
        res.status(400).send({ message: err.message });
    else next();
})

console.info('App is running on port 3000...');
app.listen(3000);
