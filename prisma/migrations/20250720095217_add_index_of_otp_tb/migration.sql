/*
  Warnings:

  - A unique constraint covering the columns `[type,country_id,value]` on the table `otps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "otps_type_country_id_value_key" ON "otps"("type", "country_id", "value");
