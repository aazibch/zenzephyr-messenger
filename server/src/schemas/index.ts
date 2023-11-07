import Joi from 'joi';
import { generateValidationMessage } from '../utils/generateValidationMessage';

export const signupSchema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9_]*$/))
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base':
        'The username may only contain alphanumeric characters (letters A-Z, numbers 0-9) and underscores (_).',
      'string.min': generateValidationMessage('min', 'username', 3),
      'string.max': generateValidationMessage('max', 'username', 50),
      'any.required': generateValidationMessage('required', 'username')
    }),
  email: Joi.string()
    .min(5)
    .max(50)
    .email()
    .required()
    .messages({
      'string.min': generateValidationMessage('min', 'email address', 5),
      'string.max': generateValidationMessage('max', 'email address', 50),
      'string.email': generateValidationMessage('email'),
      'any.required': generateValidationMessage('required', 'email address')
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': generateValidationMessage('min', 'password', 8),
      'any.required': generateValidationMessage('required', 'password')
    }),
  passwordConfirmation: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.required': generateValidationMessage(
        'required',
        'password confirmation'
      ),
      'any.only': generateValidationMessage('passwordConfirmation')
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .min(5)
    .max(50)
    .email()
    .required()
    .messages({
      'string.min': generateValidationMessage('min', 'email address', 5),
      'string.max': generateValidationMessage('max', 'email address', 50),
      'string.email': generateValidationMessage('email')
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': generateValidationMessage('min', 'password', 8)
    })
}).messages({
  'any.required': 'Please provide an email address and password.'
});

export const conversationSchema = Joi.object({
  recipient: Joi.string()
    .length(24)
    .required()
    .messages({
      'string.length': generateValidationMessage('length', 'recipient', 24),
      'any.required': generateValidationMessage('required', 'recipient')
    }),
  contentProps: Joi.object({
    type: Joi.string()
      .valid('text', 'image')
      .required()
      .messages({
        'any.required': generateValidationMessage(
          'required',
          'contentProps.type'
        ),
        'any.only': generateValidationMessage('only', 'contentProps.type', [
          'text',
          'image'
        ])
      }),
    text: Joi.when('type', {
      is: 'text',
      then: Joi.string().required().messages({
        'any.required':
          'The contentProps.text is required if contentProps.type is "text".'
      })
    }),
    image: Joi.when('type', {
      is: 'image',
      then: Joi.string().required().messages({
        'any.required':
          'The contentProps.image is required if contentProps.type is "image".'
      })
    })
  })
});

// TODO: Change format of the messages if necessary.
