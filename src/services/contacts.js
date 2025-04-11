import { sortList } from '../constants/index.js';
import ContactsCollection from '../db/models/contact.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async (
  { page = 1, perPage = 10 },
  { sortBy = '_id', sortOrder = sortList[0] },
  filters = {},
) => {
  const skipPages = (page - 1) * perPage;

  const contactQuery = ContactsCollection.find();
  if (filters.type) {
    contactQuery.where('contactType').equals(filters.type);
  }
  if (filters.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filters.isFavourite);
  }

  const data = await ContactsCollection.find()
    .merge(contactQuery)
    .skip(skipPages)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const totalItems = await ContactsCollection.find()
    .merge(contactQuery)
    .countDocuments();

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactById = (contactId) =>
  ContactsCollection.findOne({ _id: contactId });

export const addContact = (payload) => ContactsCollection.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
  const { upsert } = options;
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id },
    payload,
    {
      upsert,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContactById = (contactId) =>
  ContactsCollection.findOneAndDelete({ _id: contactId });
