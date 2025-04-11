import { contactsTypeList } from '../../constants/contacts.js';
import { trueOrFalse } from '../../constants/index.js';

export const parseContactFilterParams = ({ type, isFavourite }) => {
  const contactsType = contactsTypeList.includes(type) ? type : undefined;

  const favourite = trueOrFalse.includes(isFavourite) ? isFavourite : undefined;

  return {
    type: contactsType,
    isFavourite: favourite,
  };
};
