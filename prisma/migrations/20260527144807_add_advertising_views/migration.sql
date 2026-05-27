-- CreateTable
CREATE TABLE "advertising_views" (
    "id" TEXT NOT NULL,
    "advertising_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "advertising_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "advertising_views" ADD CONSTRAINT "advertising_views_advertising_id_fkey" FOREIGN KEY ("advertising_id") REFERENCES "advertisings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertising_views" ADD CONSTRAINT "advertising_views_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
