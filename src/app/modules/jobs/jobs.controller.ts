import { Job } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/paginationFields';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { jobFilterableFields } from './jobs.constant';
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
  const filters = pick(req.query, jobFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await JobServices.getAllJobs(filters, options);
  sendResponse<Job[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs retrieved successfully',
    meta: result.meta,
    data: result.data,
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
