import { z } from 'zod';
import { categories, locations } from './jobs.constant';

const createJobValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    company: z.string({ required_error: 'Company is required' }),
    location: z.enum(locations, { required_error: 'Location is required' }),
    category: z.enum(categories, { required_error: 'Category is required' }),
    description: z.string({ required_error: 'Description is required' }),
  }),
});

export const JobValidation = {
  createJobValidation,
};
