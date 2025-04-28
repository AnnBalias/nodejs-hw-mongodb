import path from 'node:path';

export const sortList = ['asc', 'desc'];

export const trueOrFalse = ['true', 'false'];

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMP_FILE_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_FILE_DIR = path.join(process.cwd(), 'upload');
export const APP_DOMAIN = 'APP_DOMAIN';
