-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "height" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "variantIds" TEXT,
    "width" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "adminGraphqlApiId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Images_imageId_key" ON "Images"("imageId");
