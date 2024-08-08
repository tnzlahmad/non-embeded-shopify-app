-- CreateTable
CREATE TABLE "ProductFeed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feedName" TEXT NOT NULL,
    "productFeedURL" TEXT,
    "shopName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductFeed_feedName_key" ON "ProductFeed"("feedName");
