const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/AppError');
const errorMiddleware = require('./middleware/error');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const { clientUrl } = require('./constants');

const app = express();

app.use(cors({ credentials: true, origin: clientUrl }));
app.options('*', cors({ credentials: true, origin: clientUrl }));
app.use(cookieParser());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/conversations', conversationRoutes);

app.all('*', (req, res, next) => {
  next(new AppError('Route not found.', 404));
});
app.use(errorMiddleware);

module.exports = app;
