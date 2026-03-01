import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { JobRoutes } from '../modules/jobs/jobs.route';
import { ApplicationRoutes } from '../modules/applications/applications.route';

const router = express.Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/jobs', route: JobRoutes },
  { path: '/applications', route: ApplicationRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
