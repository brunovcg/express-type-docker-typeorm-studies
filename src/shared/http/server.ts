import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import { pagination } from 'typeorm-pagination';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import uploadConfig from '@config/upload';
import isAuthenticated from './middlewares/isAuthenticated';

const app = express();

app.use(cors());

app.use(express.json());
app.use(pagination);
app.use('/files', isAuthenticated, express.static(uploadConfig.directory));
app.use(routes);
app.use(errors());
app.use(
  /*eslint-disable-next-line*/
  (error: Error, _request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
    /*eslint-disable-next-line*/
    console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  /*eslint-disable-next-line*/
  console.log('listening port 3333');
});
