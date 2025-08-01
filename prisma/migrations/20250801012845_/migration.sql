/*
  Warnings:

  - A unique constraint covering the columns `[email,number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_email_number_key" ON "users"("email", "number");
