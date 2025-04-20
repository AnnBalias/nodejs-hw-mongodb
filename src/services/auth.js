import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/session.js';
import { randomBytes } from 'node:crypto';
import {
  accessTokenLiveTime,
  refreshTokenLiveTime,
} from '../constants/auth.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLiveTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLiveTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

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

  const session = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

export const findSession = (query) => SessionCollection.findOne(query);

export const findUser = (query) => UsersCollection.findOne(query);

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await SessionCollection.findOne({
    refreshToken,
    _id: sessionId,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < Date.now) {
    await SessionCollection.findOneAndDelete({ _id: sessionId._id });
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.findOneAndDelete({ _id: sessionId._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};
