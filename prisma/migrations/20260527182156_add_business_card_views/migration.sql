-- CreateTable
CREATE TABLE "business_card_views" (
    "id" TEXT NOT NULL,
    "viewer_id" TEXT NOT NULL,
    "business_card_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_card_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "business_card_views" ADD CONSTRAINT "business_card_views_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_card_views" ADD CONSTRAINT "business_card_views_business_card_id_fkey" FOREIGN KEY ("business_card_id") REFERENCES "business_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
