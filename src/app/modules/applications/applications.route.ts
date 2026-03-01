import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ApplicationValidation } from './applications.validation';
import { ApplicationController } from './applications.controller';

const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  ApplicationController.getAllApplications,
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ApplicationController.getApplicationById,
);

router.post(
  '/',
  validateRequest(ApplicationValidation.createApplicationValidation),
  ApplicationController.submitApplication,
);

export const ApplicationRoutes = router;
