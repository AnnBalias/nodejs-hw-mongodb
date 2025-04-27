import { Router } from 'express';
import {
  authLoginShema,
  authRegisterShema,
  requestResetEmailSchema,
} from '../validation/auth.js';
import { validateBody } from '../utils/validateBody.js';
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  requestResetEmailController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterShema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(authLoginShema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);
