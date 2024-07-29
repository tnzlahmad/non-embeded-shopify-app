-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopifyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bodyHtml" TEXT,
    "createdAt" DATETIME NOT NULL,
    "handle" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "publishedScope" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "templateSuffix" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "vendor" TEXT NOT NULL,
    "adminGraphqlApiId" TEXT NOT NULL,
    "imageUrl" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopifyId_key" ON "Product"("shopifyId");
