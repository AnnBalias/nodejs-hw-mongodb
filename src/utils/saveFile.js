import createHttpError from 'http-errors';
import { ENABLE_CLOUDINARY } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';
import { saveFileToCloudinary } from './saveFileCloudinary.js';
import { saveFileToLocal } from './saveFileToLocal.js';

export const saveFile = (file) => {
  const strategy = getEnvVar(ENABLE_CLOUDINARY);
  switch (strategy) {
    case 'cloudinary':
      return saveFileToCloudinary(file);
    case 'local':
      return saveFileToLocal(file);
    default:
      throw createHttpError(500, `Unknown file saving strategy: ${strategy}`);
  }
};
