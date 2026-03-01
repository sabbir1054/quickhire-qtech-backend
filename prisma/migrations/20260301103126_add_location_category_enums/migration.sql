-- CreateEnum
CREATE TYPE "LOCATION" AS ENUM ('Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Rangpur', 'Barishal', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj', 'Tangail', 'Bogra', 'Dinajpur', 'Jessore', 'Cox_s_Bazar', 'Brahmanbaria', 'Narsingdi', 'Savar', 'Tongi', 'Faridpur', 'Jamalpur', 'Pabna', 'Habiganj', 'Moulvibazar', 'Sunamganj', 'Kushtia', 'Natore', 'Nawabganj', 'Rajbari', 'Sirajganj', 'Joypurhat', 'Naogaon', 'Nilphamari', 'Kurigram', 'Lalmonirhat', 'Gaibandha', 'Thakurgaon', 'Panchagarh', 'Sherpur', 'Netrokona', 'Kishoreganj', 'Narail', 'Satkhira', 'Bagerhat', 'Magura', 'Meherpur', 'Chuadanga', 'Jhenaidah', 'Gopalganj', 'Madaripur', 'Shariatpur', 'Munshiganj', 'Manikganj', 'Pirojpur', 'Barguna', 'Jhalokati', 'Bhola', 'Patuakhali', 'Chandpur', 'Lakshmipur', 'Noakhali', 'Feni', 'Khagrachhari', 'Rangamati', 'Bandarban', 'Remote');

-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human_Resource');

-- AlterTable: Convert location column from text to LOCATION enum
ALTER TABLE "Job" RENAME COLUMN "location" TO "location_old";
ALTER TABLE "Job" ADD COLUMN "location" "LOCATION";
UPDATE "Job" SET "location" = "location_old"::"LOCATION" WHERE "location_old" IN (SELECT unnest(enum_range(NULL::"LOCATION"))::text);
UPDATE "Job" SET "location" = 'Dhaka' WHERE "location" IS NULL;
ALTER TABLE "Job" ALTER COLUMN "location" SET NOT NULL;
ALTER TABLE "Job" DROP COLUMN "location_old";

-- AlterTable: Convert category column from text to CATEGORY enum
ALTER TABLE "Job" RENAME COLUMN "category" TO "category_old";
ALTER TABLE "Job" ADD COLUMN "category" "CATEGORY";
UPDATE "Job" SET "category" = "category_old"::"CATEGORY" WHERE "category_old" IN (SELECT unnest(enum_range(NULL::"CATEGORY"))::text);
UPDATE "Job" SET "category" = 'Technology' WHERE "category" IS NULL;
ALTER TABLE "Job" ALTER COLUMN "category" SET NOT NULL;
ALTER TABLE "Job" DROP COLUMN "category_old";
