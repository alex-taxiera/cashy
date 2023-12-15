-- CreateTable
CREATE TABLE "PlaidItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessToken" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "PlaidItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PlaidItem_ownerId_idx" ON "PlaidItem"("ownerId");
