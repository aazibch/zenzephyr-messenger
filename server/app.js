const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

module.exports = app;
