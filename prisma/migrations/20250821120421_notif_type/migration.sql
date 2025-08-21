-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('OFFER', 'WELCOME', 'GIFT', 'APPROVAL', 'INVITATION', 'OTHER');

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'OTHER';
