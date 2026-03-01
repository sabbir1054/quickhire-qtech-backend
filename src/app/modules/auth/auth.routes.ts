import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.userRegistrationValidation),
  AuthController.userRegistration,
);

router.post(
  '/login',
  validateRequest(AuthValidation.userLoginValidation),
  AuthController.userLogin,
);

router.get('/refresh-token', AuthController.refreshToken);

router.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(AuthValidation.changePasswordValidation),
  AuthController.changeUserPassword,
);

export const AuthRoutes = router;
