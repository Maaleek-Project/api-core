/*
  Warnings:

  - A unique constraint covering the columns `[account_id,company_id]` on the table `workers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "workers_account_id_company_id_key" ON "workers"("account_id", "company_id");
