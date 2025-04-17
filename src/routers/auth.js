import { Router } from 'express';
import { authRegisterShema } from '../validation/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { registerController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterShema),
  ctrlWrapper(registerController),
);
