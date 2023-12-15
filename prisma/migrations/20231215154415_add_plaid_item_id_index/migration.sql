/*
  Warnings:

  - A unique constraint covering the columns `[itemId]` on the table `PlaidItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlaidItem_itemId_key" ON "PlaidItem"("itemId");
