-- CreateTable
CREATE TABLE "Variants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "variantsId" TEXT NOT NULL,
    "barcode" TEXT,
    "compareAtPrice" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "fulfillmentService" TEXT NOT NULL,
    "grams" TEXT NOT NULL,
    "imageId" TEXT,
    "inventoryItemId" TEXT NOT NULL,
    "inventoryManagement" TEXT,
    "inventoryPolicy" TEXT NOT NULL,
    "inventoryQuantity" TEXT NOT NULL,
    "oldInventoryQuantity" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "requiresShipping" BOOLEAN NOT NULL,
    "sku" TEXT,
    "taxable" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "weight" TEXT NOT NULL,
    "weight_unit" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT,
    "option3" TEXT,
    "adminGraphqlApiId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Variants_variantsId_key" ON "Variants"("variantsId");
