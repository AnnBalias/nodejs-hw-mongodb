import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  addContactController,
  upsertContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';

export const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post('/', ctrlWrapper(addContactController));

contactsRouter.put('/:contactId', ctrlWrapper(upsertContactController));

contactsRouter.patch('/:contactId', ctrlWrapper(patchContactController));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));
