/*
  Warnings:

  - A unique constraint covering the columns `[alias]` on the table `countries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "countries_alias_key" ON "countries"("alias");
