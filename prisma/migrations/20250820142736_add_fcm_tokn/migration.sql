/*
  Warnings:

  - A unique constraint covering the columns `[fcm_token]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fcm_token` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "fcm_token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_fcm_token_key" ON "accounts"("fcm_token");
