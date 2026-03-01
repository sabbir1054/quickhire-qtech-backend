import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { JobValidation } from './jobs.validation';
import { JobController } from './jobs.controller';

const router = express.Router();

router.get('/', JobController.getAllJobs);

router.get('/:id', JobController.getJobById);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(JobValidation.createJobValidation),
  JobController.createJob,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  JobController.deleteJob,
);

export const JobRoutes = router;
