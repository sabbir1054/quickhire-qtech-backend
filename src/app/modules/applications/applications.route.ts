import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ApplicationValidation } from './applications.validation';
import { ApplicationController } from './applications.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(ApplicationValidation.createApplicationValidation),
  ApplicationController.submitApplication,
);

export const ApplicationRoutes = router;
