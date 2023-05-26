/*
  Warnings:

  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "id",
DROP COLUMN "location",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
