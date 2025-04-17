import Joi from 'joi';
import { emailRegexp } from '../constants/auth.js';

export const authRegisterShema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
    'any.required': 'Enter name',
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': 'Email must be a string',
    'any.required': 'Enter email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password should have at least 6 characters',
    'any.required': 'Enter password',
  }),
});

export const authLoginShema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.base': 'Email must be a string',
    'any.required': 'Enter email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password should have at least 6 characters',
    'any.required': 'Enter password',
  }),
});
