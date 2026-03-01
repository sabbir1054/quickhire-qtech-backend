import { z } from 'zod';

const createJobValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    company: z.string({ required_error: 'Company is required' }),
    location: z.string({ required_error: 'Location is required' }),
    category: z.string({ required_error: 'Category is required' }),
    description: z.string({ required_error: 'Description is required' }),
  }),
});

export const JobValidation = {
  createJobValidation,
};
