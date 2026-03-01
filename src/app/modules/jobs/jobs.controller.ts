import { Job } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { JobServices } from './jobs.services';

const createJob = catchAsync(async (req: Request, res: Response) => {
  const result = await JobServices.createJob(req.body);
  sendResponse<Job>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job created successfully',
    data: result,
  });
});

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await JobServices.getAllJobs();
  sendResponse<Job[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs retrieved successfully',
    data: result,
  });
});

const getJobById = catchAsync(async (req: Request, res: Response) => {
  const result = await JobServices.getJobById(req.params.id);
  sendResponse<Job>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job retrieved successfully',
    data: result,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const result = await JobServices.deleteJob(req.params.id);
  sendResponse<Job>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Job deleted successfully',
    data: result,
  });
});

export const JobController = {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
};
