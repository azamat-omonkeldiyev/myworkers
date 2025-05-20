/*
  Warnings:

  - You are about to drop the column `toolsId` on the `OrderItems` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `OrderItems` table. All the data in the column will be lost.
  - Added the required column `productId` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_toolsId_fkey";

-- AlterTable
ALTER TABLE "OrderItems" DROP COLUMN "toolsId",
DROP COLUMN "total",
ADD COLUMN     "meansureCount" DOUBLE PRECISION,
ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
