-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "badge_color" TEXT NOT NULL DEFAULT '0xff000000';
