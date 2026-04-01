-- AlterTable
ALTER TABLE "offers" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "payment_providers" ALTER COLUMN "activated" SET DEFAULT true;
