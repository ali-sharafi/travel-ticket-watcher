import express, { Request, Response, NextFunction } from 'express';
import index from './routes';

const app = express();

app.use('/api', index);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err)
        res.status(400).send({ message: err.message });
    else next();
})

app.listen(3000);