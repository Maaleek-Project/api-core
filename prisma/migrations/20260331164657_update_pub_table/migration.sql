/*
  Warnings:

  - Changed the type of `type` on the `advertisings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AdvertisingType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "advertisings" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "type",
ADD COLUMN     "type" "AdvertisingType" NOT NULL,
ALTER COLUMN "link" DROP NOT NULL;
