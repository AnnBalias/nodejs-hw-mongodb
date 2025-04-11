import {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContactById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactsSortFields } from '../db/models/contact.js';
import { parseContactFilterParams } from '../utils/filters/parseContactFilterParams.js';

export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactsSortFields);
  const filterParams = parseContactFilterParams(req.query);

  const contactsList = await getContacts(
    paginationParams,
    sortParams,
    filterParams,
  );

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsList,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const data = await getContactById(contactId);

  console.log(contactId);

  if (!data) {
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

  if (!result) {
    throw createHttpError(404, `Contact not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await deleteContactById(contactId);

  if (!data) {
    return next(createHttpError(404, `Contact not found`));
  }

  res.status(204).send();
};
