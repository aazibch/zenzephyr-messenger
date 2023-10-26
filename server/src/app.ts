import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { clientUrl } from './constants';

const app = express();
app.use(cors({ credentials: true, origin: clientUrl }));
app.options('*', cors({ credentials: true, origin: clientUrl }));
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

export default app;
