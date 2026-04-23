-- DropIndex
DROP INDEX "exchanges_requests_sender_id_recipient_id_key";

CREATE UNIQUE INDEX unique_accepted_pair ON "exchanges_requests" (sender_id, recipient_id) WHERE status = 'ACCEPTED';