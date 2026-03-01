import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { jobSearchableFields } from './jobs.constant';
import { IJob } from './jobs.interface';

const createJob = async (payload: IJob) => {
  const result = await prisma.job.create({
    data: payload,
  });
  return result;
};

const getAllJobs = async (filters: any, options: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;
  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: jobSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const conditions = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));
    andConditions.push({ AND: conditions });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.job.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.job.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
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
