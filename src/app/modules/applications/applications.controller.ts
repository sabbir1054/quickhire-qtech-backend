import { Application } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ApplicationServices } from './applications.services';

const submitApplication = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplicationServices.submitApplication(req.body);
  sendResponse<Application>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Application submitted successfully',
    data: result,
  });
});

const getAllApplications = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplicationServices.getAllApplications();
  sendResponse<Application[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Applications retrieved successfully',
    data: result,
  });
});

const getApplicationById = catchAsync(async (req: Request, res: Response) => {
  const result = await ApplicationServices.getApplicationById(req.params.id);
  sendResponse<Application>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Application retrieved successfully',
    data: result,
  });
});

export const ApplicationController = {
  submitApplication,
  getAllApplications,
  getApplicationById,
};
