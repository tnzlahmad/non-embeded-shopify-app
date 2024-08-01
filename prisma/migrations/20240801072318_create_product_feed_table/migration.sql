-- CreateTable
CREATE TABLE "ProductFeed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feedName" TEXT NOT NULL,
    "productFeedURL" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
