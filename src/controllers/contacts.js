import {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContactById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contactsList = await getContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsList,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const data = await getContactById(contactId);

  if (data === null) {
    throw createHttpError(404, `Contact not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}!`,
    data: data,
  });
};

export const addContactController = async (req, res) => {
  const data = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: data,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { data, isNew } = await updateContact(contactId, req.body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;
  const message = isNew
    ? 'Successfully add contact!'
    : 'Successfully update contact!';

  res.json({
    status,
    message,
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (result === null) {
    throw createHttpError(404, `Contact not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const data = await deleteContactById(contactId);

  if (data === null) {
    throw createHttpError(404, `Contact not found`);
  }

  res.status(204).send();
};
