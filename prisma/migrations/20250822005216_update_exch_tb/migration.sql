-- AddForeignKey
ALTER TABLE "exchanges_requests" ADD CONSTRAINT "exchanges_requests_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
