import createHttpError from 'http-errors';
import UsersCollection from '../db/models/user.js';
import bcrypt from 'bcrypt';
import SessionCollection from '../db/models/session.js';
import { randomBytes } from 'node:crypto';
import {
  accessTokenLiveTime,
  refreshTokenLiveTime,
} from '../constants/auth.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

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

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
