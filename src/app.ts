import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import index from './routes';
import bodyParser from 'body-parser';
import { TravelController } from './controllers/travelController';

const traveller = new TravelController();


const app = express();
app.use(bodyParser.json());

app.use('/api', index);

setInterval(() => {
    traveller.read();
}, 1000 * 60 * 1)//Every 10 minutes

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err)
        res.status(400).send({ message: err.message });
    else next();
})

console.info('App is running on port 3000...');
app.listen(3000);