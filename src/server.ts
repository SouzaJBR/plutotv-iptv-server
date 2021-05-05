import express, { Request, Response } from 'express';
import { router } from './routes';

const app_port = 3000;

const app = express();

app.use(router);

app.listen(app_port, () => {
    console.log(`PlutoTV server is running at port ${app_port}`);
})