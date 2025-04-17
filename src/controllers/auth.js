import { loginUser, registerUser } from '../services/auth.js';

export const registerController = async (req, res) => {
  await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully registered a user!`,
    data: {
      name: req.body.name,
      email: req.body.email,
    },
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: `Successfully logged in an user!`,
    data: {
      accessToken: session.accessToken,
    },
  });
};
