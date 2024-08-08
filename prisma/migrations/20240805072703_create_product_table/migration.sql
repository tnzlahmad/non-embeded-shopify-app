-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bodyHtml" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "handle" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "publishedAt" TIMESTAMP NOT NULL,
    "publishedScope" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "templateSuffix" TEXT,
    "updatedAt" TIMESTAMP NOT NULL,
    "vendor" TEXT NOT NULL,
    "adminGraphqlApiId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "shopName" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_productId_key" ON "Product"("productId");
