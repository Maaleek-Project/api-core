-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);
