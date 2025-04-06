import ContactsCollection from '../db/models/contact.js';

export const getContacts = () => ContactsCollection.find();

export const getContactById = (contactId) =>
  ContactsCollection.findOne({ _id: contactId });

export const addContact = (payload) => ContactsCollection.create(payload);

export const updateContact = async (_id, payload, options = {}) => {
  const { upsert } = options;
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id },
    payload,
    {
      new: true,
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
