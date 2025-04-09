import Joi from 'joi';
import { contactsTypeList } from '../constants/contacts.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contact name must be a string',
    'string.min': 'Contact name should have at least 3 characters',
    'string.max': 'Contact name should have at most 20 characters',
    'any.required': 'Enter contact name',
  }),
  phoneNumber: Joi.string().min(13).max(13).required().messages({
    'string.base': 'The phone number must be a string like +380...',
    'string.min': 'Phone number should have 13 characters',
    'string.max': 'Phone number should have 13 characters',
    'any.required': 'Enter phone number',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'The email must be a string',
    'string.min': 'Email should have at least 3 characters',
    'string.max': 'Email should have at most 20 characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactsTypeList),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Contact name must be a string',
    'string.min': 'Contact name should have at least 3 characters',
    'string.max': 'Contact name should have at most 20 characters',
  }),
  phoneNumber: Joi.string().min(13).max(13).messages({
    'string.base': 'The phone number must be a string like +380...',
    'string.min': 'Phone number should have 13 characters',
    'string.max': 'Phone number should have 13 characters',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'The email must be a string',
    'string.min': 'Email should have at least 3 characters',
    'string.max': 'Email should have at most 20 characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactsTypeList),
});
