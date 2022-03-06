import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import index from './routes';
import sequelize from './utils/database';
import bodyParser from 'body-parser';


if (process.env.APP_MODE !== 'prod')
sequelize.sync();

const app = express();
app.use(bodyParser.json());

app.use('/api', index);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err)
        res.status(400).send({ message: err.message });
    else next();
})

console.info('App is running on port 3000...');
app.listen(3000);