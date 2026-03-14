/*
  Warnings:

  - Added the required column `user_id` to the `short_url_mapping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "short_url_mapping" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "short_url_mapping" ADD CONSTRAINT "short_url_mapping_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
