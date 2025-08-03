-- CreateTable
CREATE TABLE "payment_providers" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "cover" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_providers_libelle_key" ON "payment_providers"("libelle");
