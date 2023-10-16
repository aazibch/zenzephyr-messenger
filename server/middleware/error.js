const AppError = require('../utils/AppError');

const capitalizeFirstLetter = (value) => {
  return value[0].toUpperCase() + value.slice(1);
};

const getCastError = (err) => {
  const message = `Invalid value "${
    err.value
  }" for the field "${capitalizeFirstLetter(err.path)}".`;
  return new AppError(message, 400);
};

const getDublicateFieldError = (err) => {
  let field = capitalizeFirstLetter(Object.keys(err.keyPattern)[0]);
  const message = `Duplicate value for the field "${field}".`;
  return new AppError(message, 400);
};

const getDublicateFieldErrorForEmail = (err) => {
  const message = 'An account with the same email address already exists.';
  return new AppError(message, 400);
};

const getValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => {
    if (el.name === 'CastError')
      return `Invalid value "${el.value}" for the path "${el.path}".`;

    return el.message;
  });

  const message = `The following validation errors occured: ${errors.join(
    ' '
  )}`;
  return new AppError(message, 400);
};

const sendError = (err, req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('error', err);
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong.'
  });
};

module.exports = (err, req, res, next) => {
  const { originalUrl } = req;

  if (err.name === 'CastError') err = getCastError(err);
  if (err.code === 11000) {
    if (
      originalUrl === '/v1/users/auth/signup' &&
      Object.keys(err.keyPattern)[0] === 'email'
    ) {
      err = getDublicateFieldErrorForEmail(err);
    } else {
      err = getDublicateFieldError(err);
    }
  }
  if (err.name === 'ValidationError') err = getValidationError(err);

  sendError(err, req, res);
};
