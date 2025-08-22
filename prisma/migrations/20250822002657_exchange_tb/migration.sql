-- CreateEnum
CREATE TYPE "ExchangeRequestStatus" AS ENUM ('WAITING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "exchanges_requests" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "status" "ExchangeRequestStatus" NOT NULL DEFAULT 'WAITING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exchanges_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exchanges_requests_sender_id_recipient_id_key" ON "exchanges_requests"("sender_id", "recipient_id");

-- AddForeignKey
ALTER TABLE "exchanges_requests" ADD CONSTRAINT "exchanges_requests_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
