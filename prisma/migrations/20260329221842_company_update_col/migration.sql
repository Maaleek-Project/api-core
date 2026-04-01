/*
  Warnings:

  - Added the required column `password` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "offer_id" TEXT,
ADD COLUMN     "password" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
