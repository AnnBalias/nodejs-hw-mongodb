import { contactsTypeList } from '../../constants/contacts.js';
import { trueOrFalse } from '../../constants/index.js';

export const parseContactFilterParams = ({ type, isFavourite }) => {
  const contactsType = contactsTypeList.includes(type)
    ? type
    : contactsTypeList[0];

  const favourite = trueOrFalse.includes(isFavourite)
    ? isFavourite
    : trueOrFalse[1];

  return {
    type: contactsType,
    isFavourite: favourite,
  };
};
