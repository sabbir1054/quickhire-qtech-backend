import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { IJob } from './jobs.interface';

const createJob = async (payload: IJob) => {
  const result = await prisma.job.create({
    data: payload,
  });
  return result;
};

const getAllJobs = async () => {
  const result = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getJobById = async (id: string) => {
  const result = await prisma.job.findUnique({
    where: { id },
    include: { applications: true },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  return result;
};

const deleteJob = async (id: string) => {
  const isExist = await prisma.job.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  const result = await prisma.job.delete({ where: { id } });
  return result;
};

export const JobServices = {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
};
