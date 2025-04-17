import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/session.js';
import { randomBytes } from 'node:crypto';
import {
  accessTokenLiveTime,
  refreshTokenLiveTime,
} from '../constants/auth.js';

export const registerUser = async (payload) => {
  const { email, password } = payload;

  const user = await UsersCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return await UsersCollection.create({ ...payload, password: hashPassword });
};

export const loginUser = async (payload) => {
  const { email, password } = payload;

  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(
      401,
      'This email is not registered or the entered data is invalid.',
    );
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Password is invalid.');
  }

  await SessionCollection.findOneAndDelete({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLiveTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLiveTime,
  });
};
