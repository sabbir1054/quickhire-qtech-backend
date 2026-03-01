import { CATEGORY, LOCATION } from '@prisma/client';

export type IJob = {
  title: string;
  company: string;
  location: LOCATION;
  category: CATEGORY;
  description: string;
};
