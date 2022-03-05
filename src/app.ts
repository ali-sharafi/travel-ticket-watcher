import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import index from './routes';
import sequelize from './utils/database';

if (process.env.APP_MODE !== 'prod')
    sequelize.sync();

const app = express();

app.use('/api', index);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err)
        res.status(400).send({ message: err.message });
    else next();
})

app.listen(3000);