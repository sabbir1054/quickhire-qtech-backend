import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IApplication } from './applications.interface';

const submitApplication = async (payload: IApplication) => {
  // check if job exists
  const isJobExist = await prisma.job.findUnique({
    where: { id: payload.jobId },
  });
  if (!isJobExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  const result = await prisma.application.create({
    data: {
      jobId: payload.jobId,
      name: payload.name,
      email: payload.email,
      resumeLink: payload.resumeLink,
      coverNote: payload.coverNote,
    },
    include: { job: true },
  });
  return result;
};

export const ApplicationServices = {
  submitApplication,
};
