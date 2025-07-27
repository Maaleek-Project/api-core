/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `business_cards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "business_cards_user_id_key" ON "business_cards"("user_id");
