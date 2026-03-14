-- CreateTable
CREATE TABLE "short_url_mapping" (
    "id" SERIAL NOT NULL,
    "short_url" TEXT NOT NULL,
    "real_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_expired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "short_url_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "short_url_mapping_short_url_key" ON "short_url_mapping"("short_url");
