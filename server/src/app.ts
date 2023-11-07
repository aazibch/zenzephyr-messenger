import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { clientUrl } from './constants';
import usersRoutes from './routes/usersRoutes';
import conversationsRoutes from './routes/conversationsRoutes';
import handleError from './controllers/errorController';

const app = express();
app.use(cors({ credentials: true, origin: clientUrl }));
app.options('*', cors({ credentials: true, origin: clientUrl }));
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users/', usersRoutes);
app.use('/api/v1/conversations/', conversationsRoutes);
app.use(handleError);

export default app;
