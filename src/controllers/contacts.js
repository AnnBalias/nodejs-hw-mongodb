import { getContacts, getContactById } from '../services/contacts.js';
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
