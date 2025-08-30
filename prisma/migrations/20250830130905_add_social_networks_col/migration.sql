-- AlterTable
ALTER TABLE "business_cards" ADD COLUMN     "social_networks" TEXT[] DEFAULT ARRAY[]::TEXT[];
