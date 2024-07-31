-- CreateTable
CREATE TABLE "Collect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "position" TEXT NOT NULL,
    "sortValue" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Collect_collectId_key" ON "Collect"("collectId");
